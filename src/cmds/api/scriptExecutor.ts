import { execSync } from "node:child_process"
import path from "node:path"
import { ROOT_PATH } from "../../utils/global"
import { logWarning } from "../../utils/logger"
import { randomValueScript } from "./internalScripts"

const execInternalScript = (name: string, ...args: string[]) => {
  switch (name) {
    case "randomValue":
      return randomValueScript(parseInt(args[0]))
  }

  return null
}

const execExternalScript = (name: string, ...args: string[]) => {
  const executableLocation = path.join(ROOT_PATH, "scripts")

  const fileLists = execSync(`ls ${executableLocation} | awk '{ print $1 }'`)
    .toString()
    .split("\n")
    .filter(file => file.trim() !== "")

  if (fileLists.length === 0) {
    logWarning("No external scripts found")
    return null
  }

  const targetFileName = fileLists.find(file => {
    const fileParts = file.split(".")
    return fileParts[0] === name
  })

  if (!targetFileName) {
    logWarning(`External script source for "${name}" not found`)
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
    logWarning(`External script source for "${name}" is not executable`)
    return null
  }

  try {
    const cmd = execSync(`${executableFilePath} ${args}`)
    return cmd.toString().replace("\n", "")
  } catch {
    return null
  }
}

const execShellCommand = (...args: string[]) => {
  const cmdInput = args.join(" ")
  if (!cmdInput || cmdInput.trim() === "") {
    return null
  }

  try {
    const cmd = execSync(cmdInput)
    return cmd.toString().replace("\n", "")
  } catch {
    logWarning(`Failed to execute shell command: ${cmdInput}`)
    return null
  }
}

export default function runCustomScript(
  script: string,
  ...args: string[]
) {
  if (!script || script.trim() === "") {
    logWarning("No script provided")
    return null
  }

  const targetScripts = script.split(":")
  const srcScript = targetScripts[0]

  switch (srcScript) {
    case "script":
      return execExternalScript(targetScripts[1], ...args)

    case "shell":
      return execShellCommand(...args)

    default:
      return execInternalScript(targetScripts[0], ...args)
  }
}
