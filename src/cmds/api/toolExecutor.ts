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
    .split("\n")
    .filter(file => file.trim() !== "")

  if (fileLists.length === 0) {
    return null
  }

  const targetFileName = fileLists.find(file => {
    const fileParts = file.split(".")
    return fileParts[0] === tool
  })

  if (!targetFileName) {
    return null
  }

  const executableFilePath = path.join(
    executableLocation,
    targetFileName.replace("\n", "")
  )

  const isExecutable = execSync(`ls -l ${executableFilePath} | awk '{ print $1 }'`)
    .toString()
    .charAt(3) === "x"

  if (!isExecutable) {
    return null
  }

  try {
    const cmd = execSync(`${executableFilePath} ${args}`)
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
