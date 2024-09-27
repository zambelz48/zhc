import { createCommand } from "../../utils/cmd"
import { httpRequest } from "./apiManagement"

export default createCommand(
  {
    command: "api",
    description: "API management",
    options: {
      "p:profile": "Select Profile",
      "e:env": "Select Environment",
      "c:call": "Perform API call",
      "a:args": "Arguments for API call",
      "E:edit": "Edit API call",
      "v:verbose": "Verbose output"
    }
  },
  async (options) => {
    if (options.call) {
      console.time("API Request Time")

      const response = await httpRequest(options)
      console.log("API Response:")
      console.dir(response, { depth: 5 })
      console.log()

      console.timeEnd("API Request Time")
      return
    }

    if (options.edit) {
      console.log("TODO: Editing API call...")
      return
    }
  }
)
