import { createCommand } from "../../utils/cmd"
import { createNewProfile, removeRegisteredProfile } from "./profileManagement"

export default createCommand({
  command: "profile",
  description: "Profile Management",
  options: {
    "a:add": "Add new profile",
    "r:remove": "Remove profile"
  },
}, (options) => {
    if (options.add) {
      createNewProfile(options)
      return
    }

    if (options.remove) {
      removeRegisteredProfile(options)
      return
    }
})

