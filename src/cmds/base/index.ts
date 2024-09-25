import { createCommand } from "../../utils/cmd"

const showVersion = () => {
  console.log("Version: 1.0.0")
}

const showHelp = () => {
  console.log("Usage: zhc [options]")
  console.log("Options:")
  console.log("  -v, --version    Show version")
  console.log("  -h, --help       Show help")
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
