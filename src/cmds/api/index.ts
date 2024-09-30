import { createCommand } from "../../utils/cmd"
import executeRestApi from "./rest/restApiCall"
import { getRestApiList } from "./rest/restApiManagement"

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
      "l:list": "List APIs",
      "v:verbose": "Verbose output"
    }
  },
  async (options) => {
    if (options.call) {
      executeRestApi(options)
      return
    }

    if (options.list) {
      getRestApiList(options)
      return
    }

    if (options.edit) {
      console.log("TODO: Editing API call...")
      return
    }
  }
)
