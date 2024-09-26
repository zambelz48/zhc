import { CmdDefinition, createCommand } from "../../utils/cmd"
import api from "../api"
import config from "../config"
import profile from "../profile-management"
import utility from "../utility"

const showVersion = () => {
  const packageJson = require("../../../package.json")
  const version = packageJson.version
  const buildDate = packageJson.releaseBuildDate

  console.log("ZHC CLI")
  console.log("Version:", version)
  console.log("Build date:", buildDate)
}

const showHelp = () => {
  const availableCommands = [
    config,
    api,
    profile,
    utility
  ] as CmdDefinition[]

  console.log("ZHC CLI")
  console.log()

  console.log("Usage: zhc [command] [options] [arguments]")
  console.log()

  console.log("Available Commands:")

  const minCommandLength = availableCommands.map((cmd) => cmd.command.length).sort()[availableCommands.length - 1]
  const formatCommandName = (cmd: string) => {
    const diff = minCommandLength - cmd.length
    return cmd + " ".repeat(diff)
  }

  for (const cmd of availableCommands) {
    console.log(`  ${formatCommandName(cmd.command)}\t\t${cmd.description}`)
  }
  console.log()

  console.log("Options:")
  console.log("  -v, --version\t\tShow version")
  console.log("  -h, --help\t\tShow help")
  console.log()

  console.log("Use 'zhc [command] --help' for more information about a command.")
  console.log()
}

export default createCommand({
  command: "base",
  description: "",
  options: {
    "v:version": "Show version",
    "h:help": "Show help",
  }
}, (opt) => {
  if (opt.version) {
    showVersion()
  }

  if (opt.help) {
    showHelp()
  }
})
