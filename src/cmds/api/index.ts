import { createCommand } from "../../utils/cmd"
import { httpRequest } from "./apiManagement"

export default createCommand({
  command: "api",
  description: "API management",
  options: {
    "c:call": "API call",
    "e:edit": "Edit API call",
  }
}, async (options) => {
  if (options.call) {
    console.time("API Request Time")

    const response = await httpRequest(options)
    console.log("API Response:")
    console.log(response)
    console.log()

    console.timeEnd("API Request Time")
    return
  }

  if (options.edit) {
    console.log("TODO: Editing API call...")
    return
  }
})
