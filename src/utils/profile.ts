import path from "node:path"
import fs from "node:fs"
import { createDirectory, createFile } from "./common"
import { ROOT_PATH } from "./global"

const createProfile = (name: string): string | never => {
  const profilePath = path.join(ROOT_PATH, "profiles", name)
  if (fs.existsSync(profilePath)) {
    throw new Error(`"${profilePath}" is exists`)
  }

  createDirectory({ path: profilePath, recursive: true })
  createFile({
    path: path.join(profilePath, "config.jsonc"),
    content: JSON.stringify({
      "defaultEnv": "default",
    }, null, 2)
  })

  const envPath = path.join(profilePath, "env")
  createDirectory({ path: envPath, recursive: true })
  createFile({
    path: path.join(envPath, "default.jsonc"),
    content: JSON.stringify({
      "protocol": "https",
      "baseURL": "your-base-url"
    }, null, 2)
  })

  const endpointsPath = path.join(profilePath, "endpoints")
  createDirectory({ path: endpointsPath, recursive: true })
  createFile({
    path: path.join(endpointsPath, "default.jsonc"),
    content: JSON.stringify({
      "SampleEndpoint": {
        "path": "/posts",
        "method": "GET",
        "headers": {
          "Content-Type": "application/json"
        },
        "params": {
          "id": "1"
        }
      }
    }, null, 2)
  })

  return profilePath
}

const removeProfile = (name: string) => {
  const profilePath = path.join(ROOT_PATH, "profiles", name)
  if (!fs.existsSync(profilePath)) {
    throw new Error(`"${profilePath}" is not exists`)
  }

  fs.rmdirSync(profilePath, { recursive: true })
}

export {
  createProfile,
  removeProfile
}
