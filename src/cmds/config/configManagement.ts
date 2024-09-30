import path from "node:path"
import { ROOT_PATH } from "../../utils/global"
import { createProfile } from "../../utils/profile"
import { getConfigData, getProfileConfig } from "../../utils/config"
import { logError, logInfo } from "../../utils/logger"
import { createDirectory, createFile } from "../../utils/fileOperation"

const initConfig = () => {
  try {
    logInfo("Initializing config...")

    createDirectory({ path: ROOT_PATH })

    createFile({
      path: path.join(ROOT_PATH, "config.jsonc"),
      content: JSON.stringify({
        "defaultProfile": "default",
        "editor": "nvim"
      }, null, 2)
    })

    createDirectory({ path: path.join(ROOT_PATH, "scripts") })

    try {
      const newProfile = createProfile("default")
      logInfo("New profile created at: ", newProfile)
    } catch (err) {
      logError(`${err}`)
    }

    logInfo("Config initialized")
  } catch (err) {
    logError(`${err}`)
  }
}

const setConfig = async (opt: Record<string, string | boolean>) => {
  if (typeof opt?.set !== "string" || opt?.set === "") {
    logError("No input provided")
    return
  }

  const configInput = opt?.set as string
  const configs = configInput.split(":")

  const isGlobal = opt?.global || false
  if (isGlobal) {
    console.log("Setting global config...")
    return
  }

  // TODO: add functionality to set profile config
  // globally or locally
  console.log("TODO: Set profile config")
}

const viewCurrentConfig = async () => {
  const configData = getConfigData()
  const profileConfig = getProfileConfig()

  const output: Record<string, any> = {
    ...configData,
    ...profileConfig
  }

  console.log(output)
}

export {
  initConfig,
  setConfig,
  viewCurrentConfig
}
