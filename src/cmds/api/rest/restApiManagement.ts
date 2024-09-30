import path from "node:path"
import fs from "node:fs"
import chalk from "chalk"
import { getConfigData } from "../../../utils/config"
import { PROFILES_PATH } from "../../../utils/global"
import { logError } from "../../../utils/logger"
import { formatContent } from "../../../utils/common"
import { execSync } from "node:child_process"
import { HTTPMethod } from "./restHttpMethod"

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
  const fileLists = execSync(`ls ${filePath} | awk '{ print $1 }'`)
    .toString()
    .split("\n")
    .filter(file => file.trim() !== "")

  const space = "  "

  for (let file of fileLists) {
    const isDir = fs.lstatSync(path.join(filePath, file)).isDirectory()
    if (isDir) {
      const dirName = chalk.yellow.bold(file)
      console.log(`${space.repeat(tabCount)}\u2022 ${dirName}:`)
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
      console.log(`${space.repeat(tabCount)}\u2022 ${formattedFileName}:`)

      const parsedContent = JSON.parse(formatContent(endpointContent))
      const apiList = Object.entries(parsedContent)

      for (const [key, value] of apiList) {
        const formattedKey = chalk.bold(key)

        // @ts-ignore
        const info = endpointInfo(value.method, value.path)

        console.log(`${space.repeat(tabCount+1)}\u2022 ${formattedKey}: ${info}`)
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

    console.log("API List")
    restApiInfo(endpointsDirPath)
  } catch (err) {
    logError(`${err}`)
    return undefined
  }
}
