import path from "node:path"
import fs from "node:fs"
import chalk from "chalk"
import { getConfigData } from "../../utils/config"
import { ROOT_PATH } from "../../utils/global"
import { logError } from "../../utils/logger"
import { formatContent } from "../../utils/common"
import { execSync } from "node:child_process"

const apiInfo = (filePath: string, tabCount: number = 0) => {
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
      apiInfo(path.join(filePath, file), tabCount + 1)
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
        const formattedKey = chalk.greenBright(key)
        // @ts-ignore
        const method = `[${chalk.blue(value.method)}]`
        // @ts-ignore
        console.log(`${space.repeat(tabCount+1)}\u2022 ${formattedKey}: ${method} ${value.path}`)
      }
    }
  }
}

export const getApiList = (options: Record<string, string | boolean>) => {
  try {
    const profile = options.profile as string
    const configData = getConfigData()

    const targetProfile = profile || configData?.defaultProfile
    const endpointsDirPath = path.join(
      ROOT_PATH, `profiles/${targetProfile}`, "endpoints"
    )

    console.log("API List")
    apiInfo(endpointsDirPath)
  } catch (err) {
    logError(`${err}`)
    return undefined
  }
}
