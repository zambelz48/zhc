import path from "node:path"
import os from "node:os"

export const ROOT_PATH = path.join(os.homedir(), ".zhc")

export const PROFILES_PATH = path.join(ROOT_PATH, "profiles")

export const SCRIPTS_PATH = path.join(ROOT_PATH, "scripts")

