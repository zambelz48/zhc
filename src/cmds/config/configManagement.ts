import fs from "node:fs"
import path from "node:path"
import { ROOT_PATH } from "../../utils/global"
import { createProfile } from "../../utils/profile"
import { getConfigData, getProfileConfig } from "../../utils/config"

const initConfig = () => {
  try {
    console.log("Initializing config...")

    if (!fs.existsSync(ROOT_PATH)) {
      fs.mkdirSync(ROOT_PATH)
    }

    const config = path.join(ROOT_PATH, "config.jsonc")
    if (!fs.existsSync(config)) {
      const content = {
        "defaultProfile": "default",
        "editor": "nvim"
      }
      fs.writeFileSync(config, JSON.stringify(content, null, 2))
    }

    try {
      const newProfile = createProfile("default")
      console.log("New profile created at: ", newProfile)
    } catch (err) {
      console.error(err)
    }

    console.log("Config initialized")
  } catch (err) {
    console.error(err)
  }
}

const setConfig = async (opt: Record<string, string | boolean>) => {
  if (typeof opt?.set !== "string" || opt?.set === "") {
    console.error("No input provided")
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
