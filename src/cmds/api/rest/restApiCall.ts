import path from "node:path"
import fs from "node:fs"
import { PROFILES_PATH } from "../../../utils/global"
import { formatContent } from "../../../utils/common"
import { getConfigData } from "../../../utils/config"
import { logError, logInfo } from "../../../utils/logger"
import runCustomScript from "../shared/scriptExecutor"
import { HTTPMethod } from "./restHttpMethod"

const getEnvData = (
  profile?: string,
  env?: string
): Record<string, any> | undefined => {
  try {
    const configData = getConfigData()

    const targetProfile = profile || configData?.defaultProfile
    const envDirPath = path.join(PROFILES_PATH, targetProfile, "env")
    const targetEnv = `${env || "default"}.jsonc`
    const envFilePath = path.join(envDirPath, targetEnv)

    const envContent = fs.readFileSync(envFilePath, "utf-8")
    const parsedContent = JSON.parse(formatContent(envContent))

    return parsedContent
  } catch (err) {
    return undefined
  }
}

const getEndpointData = (
  name: string,
  profile?: string
): Record<string, any> | undefined => {
  if (!name || name.trim() === "") {
    throw new Error("Name is required")
  }

  try {
    const configData = getConfigData()

    const targetProfile = profile || configData?.defaultProfile
    const endpointsDirPath = path.join(
      PROFILES_PATH, targetProfile, "endpoints"
    )

    const targetEndpointPath = name.split(":").slice(0, -1).join("/")
    const targetEndpointName = name.split(":").slice(-1)[0]
    const endpointFilePath = path.join(
      endpointsDirPath, `${targetEndpointPath || "default"}.jsonc`
    )

    const endpointContent = fs.readFileSync(endpointFilePath, "utf-8")
    const parsedContent = JSON.parse(formatContent(endpointContent))

    const data = Object.entries(parsedContent)
      .filter(([key]) => key === targetEndpointName)[0]

    return data[1] as Record<string, any>
  } catch (err) {
    logError(`${err}`)
    return undefined
  }
}

const assignValueFromVar = (
  src: Record<string, any>,
  target: Record<string, any>
) => {
  let result = { ...target }

  const hasBracket = (str: string) => {
    return str[0] === "{" && str[1] === "{"
      && str[str.length - 1] === "}" && str[str.length - 2] === "}"
  }

  for (const [key, value] of Object.entries(target)) {
    if (!hasBracket(value)) {
      continue
    }

    const paramKey = value.slice(2, value.length - 2)
    if (src[paramKey]) {
      result[key] = src[paramKey]
    } else {
      result[key] = ""
    }
  }

  return result
}

const assignValueFromArgs = (
  target: Record<string, any>,
  args?: string
) => {
  let result = { ...target }

  if (!args || args.trim() === "") {
    return result
  }

  const argObjects = args.split(":").map((arg) => {
    const [key, value] = arg.split("=")
    return { [key]: value }
  })

  for (const arg of argObjects) {
    const key = Object.keys(arg)[0]
    const value = Object.values(arg)[0]
    if (target[key]) {
      result[key] = value
    }
  }

  return result
}

const assignValueFromScript = (target: Record<string, any>) => {
  let result = { ...target }

  const hasScriptSign = (str: string) => {
    return str[0] === "<" && str[1] === "%"
      && str[str.length - 2] === "%" && str[str.length - 1] === ">"
  }

  const getScriptName = (key: string): string => {
    const openParenthesisIndex = key.indexOf("(")
    return key.slice(2, openParenthesisIndex)
  }

  const getArgs = (key: string): string[] => {
    const openParenthesisIndex = key.indexOf("(")
    const closeParenthesisIndex = key.indexOf(")")

    return key.slice(openParenthesisIndex + 1, closeParenthesisIndex)
      .split(",")
  }

  for (const [key, value] of Object.entries(target)) {
    if (!hasScriptSign(value)) {
      continue
    }

    const scriptName = getScriptName(value)
    const scriptFn = value.slice(2, value.length - 2)
    const args = getArgs(scriptFn)
    const valueFromScript = runCustomScript(scriptName, ...args)
    if (valueFromScript) {
      result[key] = valueFromScript
    }
  }

  return result
}

const configureRequest = (
  envData: Record<string, any> | undefined,
  endpointData: Record<string, any> | undefined,
  additionalArgs: string
): {
  method: HTTPMethod,
  finalURL: string,
  requestData: Record<string, any>
} => {
  if (!envData || !endpointData) {
    logError("Environment or endpoint data not found")
    return { method: "GET", finalURL: "", requestData: {} }
  }

  const fullURL = `${envData.protocol}://${envData.baseURL}${endpointData["path"]}`
  const method: HTTPMethod = endpointData["method"]
  const headers: Record<string, string> = assignValueFromScript(
    assignValueFromArgs(
      assignValueFromVar(envData, endpointData["headers"]),
      additionalArgs
    )
  )
  const params = assignValueFromScript(
    assignValueFromArgs(
      assignValueFromVar(envData, endpointData["params"]),
      additionalArgs
    )
  )

  let finalURL = fullURL
  let requestData: Record<string, any> = {}
  switch (method) {
    case "GET":
      // TODO: Need to revisit this part
      finalURL = params && Object.keys(params).length > 0
        ? `${fullURL}?${new URLSearchParams(params).toString()}`
        : fullURL
      requestData = {
        method,
        headers
      }
      break
    case "POST":
    case "PUT":
    case "PATCH":
      requestData = {
        method,
        headers,
        body: params ? params : ""
      }
      break
    case "DELETE":
      break
  }

  return { method, finalURL, requestData }
}

const constructResponse = async (
  method: string,
  response: Response
) => {
  let responseHeaders: Record<string, string> = {}
  for (const [key, value] of response.headers.entries()) {
    responseHeaders[key] = value
  }

  const result: Record<string, unknown> = {}

  if (response.status > 499) {
    result["status"] = response.status
    result["error"] = response.statusText

    return result
  }

  const responseBody = await response.json()
  result[method] = response.url
  result["status"] = response.status
  result["headers"] = responseHeaders
  result["cookie"] = response.headers.getSetCookie()
  result["body"] = responseBody

  return result
}

const httpRequest = async (opt: Record<string, string | boolean>) => {
  try {
    const envData = getEnvData(opt?.profile as string, opt?.env as string)
    if (!envData) {
      logError("Environment data not found")
      return
    }

    const protocol = envData.protocol as string
    const baseURL = envData.baseURL as string
    if (!protocol || !baseURL) {
      logError("Base URL not found")
      return
    }

    const name = opt?.call as string
    const endpointData = getEndpointData(name, opt?.profile as string)
    if (!endpointData) {
      logError("Endpoint data not found")
      return
    }

    const additionalArgs = opt?.args as string
    const { method, finalURL, requestData } = configureRequest(
      envData,
      endpointData,
      additionalArgs
    )

    if (opt?.verbose) {
      logInfo("[REST] Request Payload:")
      console.log({ destination: finalURL, ...requestData })
      console.log()
    }

    const response = await fetch(
      finalURL,
      {
        ...requestData,
        body: JSON.stringify(requestData.body)
      } as RequestInit
    )

    return constructResponse(method, response)
  } catch (err) {
    logError(`${err}`)
  }
}

export default async function executeRestApi(
  options: Record<string, string | boolean>
) {
  console.time("[REST] API Request Time")

  const response = await httpRequest(options)
  console.log("[REST] API Response:")
  console.dir(response, { depth: 5 })
  console.log()

  console.timeEnd("[REST] API Request Time")
}
