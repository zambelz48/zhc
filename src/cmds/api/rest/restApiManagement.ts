import path from "node:path"
import fs from "node:fs"
import chalk from "chalk"
import { getConfigData } from "../../../utils/config"
import { PROFILES_PATH } from "../../../utils/global"
import { logError } from "../../../utils/logger"
import { formatContent, spacer } from "../../../utils/common"
import { HTTPMethod } from "./restHttpMethod"
import { isDirectory } from "../../../utils/fileOperation"

const endpointInfo = (method: HTTPMethod, path: string) => {
  switch (method) {
    case "GET":
      return chalk.hex("#6fa8fc")(`[${method}] ${path}`)
    case "PUT":
      return chalk.hex("#fb983c")(`[${method}] ${path}`)
    case "POST":
      return chalk.hex("#49f176")(`[${method}] ${path}`)
    case "DELETE":
      return chalk.hex("#f73a3d")(`[${method}] ${path}`)
    case "OPTIONS":
      return chalk.hex("#348EEE")(`[${method}] ${path}`)
    case "HEAD":
      return chalk.hex("#8522f6")(`[${method}] ${path}`)
    case "PATCH":
      return chalk.hex("#49ddba")(`[${method}] ${path}`)
  }
}

const restApiInfo = (filePath: string, tabCount: number = 0) => {
  const fileLists = fs.readdirSync(filePath)
  const space = spacer(tabCount)

  for (let file of fileLists) {
    const isDir = isDirectory(path.join(filePath, file))
    if (isDir) {
      const dirName = chalk.yellow.bold(file)
      console.log(`${space}\u2022 ${dirName}:`)
      restApiInfo(path.join(filePath, file), tabCount + 1)
    } else {
      const endpointFilePath = path.join(
        filePath,
        file || "default"
      )

      const endpointContent = fs.readFileSync(endpointFilePath, "utf-8")
      if (!endpointContent || endpointContent.length === 0) {
        continue
      }

      const formattedFileName = chalk.yellow.bold(file.replace(".jsonc", ""))
      console.log(`${space}\u2022 ${formattedFileName}:`)

      const parsedContent = JSON.parse(formatContent(endpointContent))
      const apiList = Object.entries(parsedContent)

      for (const [key, value] of apiList) {
        const formattedKey = chalk.bold(key)

        // @ts-ignore
        const info = endpointInfo(value.method, value.path)

        console.log(`${spacer(tabCount+1)}\u2022 ${formattedKey}: ${info}`)
      }
    }
  }
}

export const getRestApiList = (options: Record<string, string | boolean>) => {
  try {
    const profile = options.profile as string
    const configData = getConfigData()

    const targetProfile = profile || configData?.defaultProfile
    const endpointsDirPath = path.join(
      PROFILES_PATH, targetProfile, "endpoints"
    )

    console.log()
    console.log(`API List (${chalk.yellow(targetProfile)})`)
    console.log()

    restApiInfo(endpointsDirPath)
  } catch (err) {
    logError(`${err}`)
    return undefined
  }
}
