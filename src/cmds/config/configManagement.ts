import fs from "node:fs"
import path from "node:path"
import { ROOT_PATH } from "../../utils/global"
import { createProfile } from "../../utils/profile"

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

const loadConfig = async (opt: Record<string, string | boolean>) => {
  console.log("Loading config...")
  console.log("Option 1:", opt?.opt1)
  console.log("Option 2:", opt?.opt2)
}

export {
  initConfig,
  loadConfig
}
