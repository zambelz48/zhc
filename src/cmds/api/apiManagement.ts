import path from "node:path"
import os from "node:os"
import fs from "node:fs"

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

const getBaseURL = (profile?: string, env?: string) => {
  try {
    const zhcPath = path.join(os.homedir(), ".zhc")
    const config = path.join(zhcPath, "config.jsonc")
    const content = fs.readFileSync(config, "utf-8")
    const configData = JSON.parse(content)

    const targetProfile = profile || configData.defaultProfile
    const profilePath = `profiles/${targetProfile}`

    const envDirPath = path.join(zhcPath, profilePath, "env")
    const targetEnv = `${env || "default"}.jsonc`
    const envFilePath = path.join(envDirPath, targetEnv)

    const envContent = fs.readFileSync(envFilePath, "utf-8")
    const envData = JSON.parse(envContent)

    return envData?.baseURL
  } catch (err) {
    return undefined
  }
}

const getEndpointData = (name: string, profile?: string): Record<string, any> | undefined => {
  if (!name) {
    throw new Error("Name is required")
  }

  try {
    const zhcPath = path.join(os.homedir(), ".zhc")
    const config = path.join(zhcPath, "config.jsonc")
    const content = fs.readFileSync(config, "utf-8")
    const configData = JSON.parse(content)

    const targetProfile = profile || configData.defaultProfile
    const profilePath = `profiles/${targetProfile}`

    const endpointsDirPath = path.join(zhcPath, profilePath, "endpoints")
    const targetEndpoint = `default.jsonc`
    const endpointFilePath = path.join(endpointsDirPath, targetEndpoint)

    const endpointContent = fs.readFileSync(endpointFilePath, "utf-8")
    const parsedContent = JSON.parse(endpointContent)

    const data = Object.entries(parsedContent)
      .filter(([key]) => key === name)[0]

    return data[1] as Record<string, any>
  } catch (err) {
    console.error(err)
    return undefined
  }
}

const configureRequest = (
  baseURL: string,
  endpointData: Record<string, any>
) => {
  const fullURL = `${baseURL}${endpointData["path"]}`
  const method: HTTPMethod = endpointData["method"]
  const headers: Record<string, string> = endpointData["headers"]
  const params: Record<string, any> = endpointData["params"]

  let finalURL = fullURL
  let requestInit: RequestInit = {}
  switch (method) {
    case "GET":
      finalURL = params
        ? `${fullURL}?${new URLSearchParams(params).toString()}`
        : fullURL
      requestInit = {
        method,
        headers
      }
      break
    case "POST":
    case "PUT":
    case "PATCH":
      requestInit = {
        method,
        headers,
        body: params ? JSON.stringify(params) : ""
      }
      break
    case "DELETE":
      break
  }

  return { method, finalURL, requestInit }
}

const constructResponse = async (method: string, response: Response) => {
  let responseHeaders: Record<string, string> = {}
  for (const [key, value] of response.headers.entries()) {
    responseHeaders[key] = value
  }

  const responseBody = await response.json()
  const result: Record<string, any> = {}
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
    const baseURL = getBaseURL(opt?.profile as string, opt?.env as string)
    if (!baseURL) {
      console.error("Base URL not found")
      return
    }

    const name = opt?.call as string
    const endpointData = getEndpointData(name, opt?.profile as string)
    if (!endpointData) {
      console.error("Endpoint data not found")
      return
    }

    const { method, finalURL, requestInit } = configureRequest(
      baseURL,
      endpointData
    )

    const response = await fetch(finalURL, requestInit)
    return constructResponse(method, response)
  } catch (err) {
    console.error(err)
  }
}

export {
  httpRequest
}
