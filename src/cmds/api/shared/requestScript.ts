import vm from "node:vm"
import fs from "node:fs"
import path from "node:path"
import { SCRIPTS_PATH } from "../../../utils/global"
import { logWarning } from "../../../utils/logger"
import { appendFile } from "../../../utils/fileOperation"
import { parseContent } from "../../../utils/common"

const builtInModules = (showLog: boolean = false) => {
  const defaultModules = {
    btoa,
    atob,
    fs,
    path,
    JSON
  }

  if (showLog) {
    return { ...defaultModules, console }
  }

  return defaultModules
}

const loadScript = (
  type: "Pre" | "Post",
  scriptName: string
): string | undefined => {
  const finalScriptName = `${scriptName}.js`
  const scriptLocation = path.join(SCRIPTS_PATH, finalScriptName)
  if (!fs.existsSync(scriptLocation)) {
    logWarning(`${type}-request script "${finalScriptName}.js" not found`)
    return undefined
  }

  const script = fs.readFileSync(scriptLocation, "utf-8")
  return script
}

const updateEnv = (
  path: string,
  unparsedData: { line: number, value: string }[],
  parsedData: Record<string, any>
) => {
  const totalLines = (unparsedData.length + Object.keys(parsedData).length)
  if (totalLines === 0) {
    logWarning("Failed to update env file")
    return
  }

  const indexedParsedData = Object.entries(parsedData)
  let nextParsedIndex = 0

  const contents: string[] = ["{\n"]

  for (let i = 1; i < totalLines; i++) {
    const unparsedContent = unparsedData.find(line => line.line === i)
    if (unparsedContent) {
      let unparsedContentValue = unparsedContent.value
      if (unparsedContentValue !== "\n") {
        unparsedContentValue += "\n"
      }
      contents.push(unparsedContentValue)
      continue
    }

    const [key, value] = indexedParsedData[nextParsedIndex]
    let parsedContent = `\t"${key}": "${value}"`
    if (nextParsedIndex < indexedParsedData.length - 1) {
      parsedContent += ","
    }
    parsedContent += "\n"
    contents.push(parsedContent)
    nextParsedIndex++
  }

  contents.push("\n}")

  appendFile({
    path,
    force: true,
    contents
  })
}

export const execPreRequestScript = async (
  scriptName: string,
  env: {
    path: string
    content: string
  },
  showLog: boolean = false
) => {
  const script = loadScript("Pre", scriptName)
  if (!script) {
    logWarning("Failed to load Pre-request script content")
    return
  }

  const content = parseContent(env.content)
  const variables = content.parsed

  vm.runInNewContext(
    script,
    { variables, ...builtInModules(showLog) }
  )

  updateEnv(env.path, content.unparseable, variables)
}

export const execPostRequestScript = async (
  scriptName: string,
  env: {
    path: string
    content: string
  },
  response: Record<string, any>,
  showLog: boolean = false
) => {
  const script = loadScript("Post", scriptName)
  if (!script) {
    logWarning("Failed to load Post-request script content")
    return
  }

  const content = parseContent(env.content)
  const variables = content.parsed

  vm.runInNewContext(
    script,
    { variables, response, ...builtInModules(showLog)}
  )

  updateEnv(env.path, content.unparseable, variables)
}
