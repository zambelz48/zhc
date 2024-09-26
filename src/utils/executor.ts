import { CmdExecutor } from "./cmd"

const execute = async (cmds: CmdExecutor[], args: string[]) => {
  if (args.length === 0 || args[0].startsWith("-")) {
    const commonCommand = cmds.find((cmd) => cmd.command === "base")
    commonCommand?.action(args)
    return
  }

  const command = cmds.find((cmd) => cmd.command === args[0])
  if (command) {
    command.action(args.slice(1))
    return
  }
}

export default execute
