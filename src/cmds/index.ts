import { CmdExecutor } from "../utils/cmd"
import api from "./api"
import base from "./base"
import config from "./config"
import profile from "./profile-management"
import utility from "./utility"

export default [
  base,
  config,
  api,
  profile,
  utility
] as CmdExecutor[]
