import vm from "node:vm"
import fs from "node:fs"
import path from "node:path"
import { SCRIPTS_PATH } from "../../../utils/global"
import { logWarning } from "../../../utils/logger"
import { createFile } from "../../../utils/fileOperation"

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

const loadScript = (type: "Pre" | "Post", scriptName: string) => {
  const finalScriptName = `${scriptName}.js`
  const scriptLocation = path.join(SCRIPTS_PATH, finalScriptName)
  if (!fs.existsSync(scriptLocation)) {
    logWarning(`${type}-request script "${finalScriptName}.js" not found`)
    return
  }

  const script = fs.readFileSync(scriptLocation, "utf-8")
  return script
}

const updateEnv = (
  path: string,
  data: Record<string, any>
) => {
  const updatedEnv = JSON.stringify(data, null, 2)
  createFile({
    path: path,
    content: updatedEnv,
    force: true
  })
}

export const execPreRequestScript = async (
  scriptName: string,
  env: {
    path: string
    data: Record<string, any>
  },
  showLog: boolean = false
) => {
  const script = loadScript("Pre", scriptName)
  if (!script) {
    logWarning("Failed to load Pre-request script content")
    return
  }

  const variables = env.data

  vm.runInNewContext(
    script,
    { variables, ...builtInModules(showLog) }
  )

  updateEnv(env.path, variables)
}

export const execPostRequestScript = async (
  scriptName: string,
  env: {
    path: string
    data: Record<string, any>
  },
  response: Record<string, any>,
  showLog: boolean = false
) => {
  const script = loadScript("Post", scriptName)
  if (!script) {
    logWarning("Failed to load Post-request script content")
    return
  }

  const variables = env.data

  vm.runInNewContext(
    script,
    { variables, response, ...builtInModules(showLog)}
  )

  updateEnv(env.path, variables)
}
