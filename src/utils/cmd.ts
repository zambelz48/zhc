import chalk from "chalk"
import { spacer } from "./common"

export interface CmdDefinition {
  command: string
  description: string
  options: Record<string, string>
}

export interface CmdExecutor extends CmdDefinition {
  action: (args: string[]) => void
}

const parseOptions = (args: string[]): Record<string, string | boolean> => {
  const result: { [key: string]: string | boolean } = {}

  for (let i = 0; i < args.length; i++) {
    let key = ""
    if (args[i].startsWith("-")) {
      key = args[i].slice(1)
    }

    if (args[i].startsWith("--")) {
      key = args[i].slice(2)
    }

    const valueIndex = i + 1
    const value = args[valueIndex]
    const isKeyEmpty = key.trim() === ""

    if (!isKeyEmpty && value && (!value.startsWith("-") || !value.startsWith("--"))) {
      result[key] = value
    }

    if (!isKeyEmpty && !value) {
      result[key] = true
    }
  }

  return result
}

export const createCommand = (
  cmd: CmdDefinition,
  action: (opt: Record<string, string | boolean>) => void
): CmdExecutor => {
  return {
    ...cmd,
    action: (args: string[]) => {
      const option = parseOptions(args)

      const hasHelpOpt = Object.keys(option)
        .filter((opt) => opt === "h" || opt === "help").length > 0

      if (cmd.command !== "base" && hasHelpOpt) {
        const space = spacer()

        console.log()
        console.log(chalk.green("ZHC CLI"))
        console.log()

        console.log(cmd.description)
        console.log()

        console.log(`${chalk.yellow("Usage:")} zhc ${cmd.command} [options]`)
        console.log()

        console.log(`${chalk.yellow("Options:")}`)
        for (const [key, value] of Object.entries(cmd.options)) {
          const pairedKey = key.split(":")
          const shortOpt = chalk.green(`-${pairedKey[0]}`)
          const longOpt = chalk.green(`--${pairedKey[1]}`)
          console.log(`${space}${shortOpt}, ${longOpt}\t\t${value}`)
        }
        return
      }

      const optKeys = Object.keys(cmd.options)
      const splittedOptKeys = optKeys.map((opt) => opt.split(":"))
      for (const key in option) {
        for (const splittedOptKey of splittedOptKeys) {
          if (splittedOptKey.includes(key)) {
            option[splittedOptKey[1]] = option[key]
            if (key.length === 1) {
              delete option[key]
            }
          }
        }
      }

      action(option)
    }
  }
}
