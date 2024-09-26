import path from "node:path"
import fs from "node:fs"
import { ROOT_PATH } from "../../utils/global"
import apiTools from "./tools"

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

const getConfigData = (): Record<string, any> | undefined => {
  const config = path.join(ROOT_PATH, "config.jsonc")
  const content = fs.readFileSync(config, "utf-8")

  return JSON.parse(content)
}

const getEnvData = (
  profile?: string,
  env?: string
): Record<string, any> | undefined => {
  try {
    const configData = getConfigData()

    const targetProfile = profile || configData?.defaultProfile
    const profilePath = `profiles/${targetProfile}`

    const envDirPath = path.join(ROOT_PATH, profilePath, "env")
    const targetEnv = `${env || "default"}.jsonc`
    const envFilePath = path.join(envDirPath, targetEnv)

    const envContent = fs.readFileSync(envFilePath, "utf-8")
    const formattedContent = envContent.replace(/\/\/.*/g, "")
    const parsedContent = JSON.parse(formattedContent)

    return parsedContent
  } catch (err) {
    return undefined
  }
}

const getEndpointData = (
  name: string,
  profile?: string
): Record<string, any> | undefined => {
  if (!name) {
    throw new Error("Name is required")
  }

  const splittedName = name.split(":")
  if (splittedName.length > 1 && splittedName.length < 3) {
    throw new Error("Invalid name format")
  }

  const endpointGroup = splittedName[0] || ""
  const endpointFile = splittedName[1] || ""
  const endpointName = splittedName.length === 0
    ? splittedName[0]
    : splittedName[2]

  try {
    const configData = getConfigData()

    const targetProfile = profile || configData?.defaultProfile
    const profilePath = `profiles/${targetProfile}`

    const endpointsDirPath = path.join(ROOT_PATH, profilePath, "endpoints")
    const targetEndpointDir = path.join(endpointsDirPath, endpointGroup)
    const targetEndpoint = `${endpointFile !== "" ? endpointFile : "default"}.jsonc`
    const endpointFilePath = path.join(targetEndpointDir, targetEndpoint)

    const endpointContent = fs.readFileSync(endpointFilePath, "utf-8")
    const parsedContent = JSON.parse(endpointContent)

    const data = Object.entries(parsedContent)
      .filter(([key]) => key === endpointName)[0]

    return data[1] as Record<string, any>
  } catch (err) {
    console.error(err)
    return undefined
  }
}

const assignValue = (
  src: Record<string, any>,
  target: Record<string, any>
) => {
  let result = { ...target }

  const hasOpenBracket = (str: string) => {
    return str[0] === "{" && str[1] === "{"
  }
  const hasCloseBracket = (str: string) => {
    return str[str.length - 1] === "}" && str[str.length - 2] === "}"
  }

  for (const [key, value] of Object.entries(target)) {
    if (hasOpenBracket(value) && hasCloseBracket(value)) {
      const paramKey = value.slice(2, value.length - 2)
      if (src[paramKey]) {
        result[key] = src[paramKey]
      } else {
        result[key] = ""
      }
    }
  }

  return result
}

const assignValueWithTool = (target: Record<string, any>) => {
  let result = { ...target }

  const hasToolSign = (str: string) => {
    return str[0] === "<"
      && str[1] === "%"
      && str[str.length - 2] === "%"
      && str[str.length - 1] === ">"
  }

  const getToolName = (key: string): string => {
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
    if (hasToolSign(value)) {
      const toolName = getToolName(value)
      const toolFn = value.slice(2, value.length - 2)
      const args = getArgs(toolFn)
      const valueFromTool = apiTools(toolName, ...args)
      if (valueFromTool) {
        result[key] = valueFromTool
      }
    }
  }

  return result
}

const configureRequest = (
  envData: Record<string, any> | undefined,
  endpointData: Record<string, any> | undefined
): {
  method: HTTPMethod,
  finalURL: string,
  requestData: Record<string, any>
} => {
  if (!envData || !endpointData) {
    console.error("Environment or endpoint data not found")
    return { method: "GET", finalURL: "", requestData: {} }
  }

  const fullURL = `${envData.protocol}://${envData.baseURL}${endpointData["path"]}`
  const method: HTTPMethod = endpointData["method"]
  const headers: Record<string, string> = assignValue(envData, endpointData["headers"])
  const params: Record<string, any> = assignValue(envData, endpointData["params"])

  const finalHeaders = assignValueWithTool(headers)
  const finalParams = assignValueWithTool(params)

  let finalURL = fullURL
  let requestData: Record<string, any> = {}
  switch (method) {
    case "GET":
      finalURL = params && Object.keys(finalParams).length > 0
        ? `${fullURL}?${new URLSearchParams(finalParams).toString()}`
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
        headers: finalHeaders,
        body: finalParams ? finalParams : ""
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

  const result: Record<string, any> = {}

  if (response.status > 499) {
    result["status"] = response.status
    result["error"] = response.statusText

    return result
  }

  const responseBody = await response.json()
  result["type"] = response.type
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
      console.error("Environment data not found")
      return
    }

    const protocol = envData.protocol as string
    const baseURL = envData.baseURL as string
    if (!protocol || !baseURL) {
      console.error("Base URL not found")
      return
    }

    const name = opt?.call as string
    const endpointData = getEndpointData(name, opt?.profile as string)
    if (!endpointData) {
      console.error("Endpoint data not found")
      return
    }

    const { method, finalURL, requestData } = configureRequest(
      envData,
      endpointData
    )

    if (opt?.verbose) {
      console.log("Request Info:")
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
    console.error(err)
  }
}

export {
  httpRequest
}
