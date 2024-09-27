import path from "node:path"
import fs from "node:fs"
import { ROOT_PATH } from "./global"

const getConfigData = (): Record<string, any> | undefined => {
  const config = path.join(ROOT_PATH, "config.jsonc")
  const content = fs.readFileSync(config, "utf-8")

  return JSON.parse(content)
}

const getProfileConfig = (profile?: string) => {
  const configData = getConfigData()

  const targetProfile = profile || configData?.defaultProfile
  const profilePath = `profiles/${targetProfile}`
  const profileConfigPath = path.join(ROOT_PATH, profilePath, "config.jsonc")
  const profileConfigContent = fs.readFileSync(profileConfigPath, "utf-8")
  const profileConfig = JSON.parse(profileConfigContent)

  return profileConfig
}

export {
  getConfigData,
  getProfileConfig
}
