import { execSync } from "node:child_process"
import path from "node:path"
import { ROOT_PATH } from "../../utils/global"
import { randomValue } from "./internalTools"

const execInternalTool = (tool: string, ...args: string[]) => {
  switch (tool) {
    case "randomValue":
      return randomValue(parseInt(args[0]))
  }

  return null
}

const execExternalTool = (tool: string, ...args: string[]) => {
  const executableLocation = path.join(ROOT_PATH, "tools")

  const fileLists = execSync(`ls ${executableLocation} | awk '{ print $1 }'`)
    .toString()
    .replace("\n", ",")
  if (fileLists.length === 0) {
    return null
  }

  const fileName = fileLists.split(",")
    .find(file => file.includes(tool))

  if (!fileName) {
    return null
  }

  const executableFilePath = path.join(
    executableLocation,
    fileName.replace("\n", "")
  )

  let platformCmd = ""
  if (executableFilePath.includes(".sh")) {
    platformCmd = "sh"
  } else if (executableFilePath.includes(".js")) {
    platformCmd = "node"
  } else if (executableFilePath.includes(".ts")) {
    platformCmd = "ts-node"
  } else if (executableFilePath.includes(".py")) {
    platformCmd = "python"
  } else if (executableFilePath.includes(".rb")) {
    platformCmd = "ruby"
  } else if (executableFilePath.includes(".go")) {
    platformCmd = "go run"
  } else {
    return null
  }

  try {
    const cmd = execSync(`${platformCmd} ${executableFilePath} ${args}`)
    return cmd.toString().replace("\n", "")
  } catch {
    return null
  }
}

const execShellTool = (...args: string[]) => {
  const cmdInput = args.join(" ")
  if (!cmdInput || cmdInput.trim() === "") {
    return null
  }

  try {
    const cmd = execSync(cmdInput)
    return cmd.toString().replace("\n", "")
  } catch {
    return null
  }
}

export default function runApiTool(
  tool: string,
  ...args: string[]
) {
  if (!tool || tool.trim() === "") {
    return null
  }

  const targetTools = tool.split(":")
  const srcTool = targetTools[0]

  switch (srcTool) {
    case "external":
      return execExternalTool(targetTools[1], ...args)

    case "shell":
      return execShellTool(...args)

    default:
      return execInternalTool(targetTools[0], ...args)
  }
}
