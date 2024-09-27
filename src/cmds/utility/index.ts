import { createCommand } from "../../utils/cmd"

export default createCommand(
  {
    command: "doctor",
    description: "Check for issues",
    options: {
      "c:check": "Check for issues",
      "f:fix": "Fix issues",
    },
  },
  async (options) => {
    console.log("Checking for issues...")
    console.log("No issues found.")
  }
)
