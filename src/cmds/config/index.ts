import { createCommand } from "../../utils/cmd"
import { initConfig, loadConfig } from "./configManagement"

export default createCommand({
  command: "config",
  description: "Configuration management",
  options: {
    "i:init": "Initialize",
    "l:load": "Load config"
  }
}, async (options) => {
  if (options.init) {
    initConfig()
  } else if (options.load) {
    await loadConfig(options)
  }
})
