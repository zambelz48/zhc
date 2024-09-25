#!/usr/bin/env node

import cmds from "./cmds"
import execute from "./utils/executor"

(async () => {
  const args = process.argv.slice(2)
  execute(cmds, args)
})()
