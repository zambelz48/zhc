import { createCommand } from "../../utils/cmd"
import { initConfig, setConfig, viewCurrentConfig } from "./configManagement"

export default createCommand(
  {
    command: "config",
    description: "Configuration management",
    options: {
      "i:init": "Initialize ZHC configuration",
      "s:set": "Show or configure current shell"
    }
  },
  async (options) => {
    if (options.init) {
      initConfig()
      return
    }

    if (options.set) {
      setConfig(options)
      return
    }

    viewCurrentConfig()
  }
)
