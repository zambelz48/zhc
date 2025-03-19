import path from "node:path"
import fs from "node:fs"
import { PROFILES_PATH } from "./global"
import { createDirectory, createFile } from "./fileOperation"

const createProfile = (name: string): string | never => {
  const profilePath = path.join(PROFILES_PATH, name)
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
      "baseURL": "dummyjson.com"
    }, null, 2)
  })

  const endpointsPath = path.join(profilePath, "endpoints")
  createDirectory({ path: endpointsPath, recursive: true })
  createFile({
    path: path.join(endpointsPath, "default.jsonc"),
    content: JSON.stringify({
      "sample_get_all": {
        "path": "/posts",
        "method": "GET",
        "headers": {
          "Content-Type": "application/json"
        },
        "params": {}
      },
      "sample_get_single": {
        "path": "/posts/1",
        "method": "GET",
        "headers": {
          "Content-Type": "application/json"
        },
        "params": {}
      }

    }, null, 2)
  })

  return profilePath
}

const removeProfile = (name: string) => {
  const profilePath = path.join(PROFILES_PATH, name)
  if (!fs.existsSync(profilePath)) {
    throw new Error(`"${profilePath}" is not exists`)
  }

  fs.rmdirSync(profilePath, { recursive: true })
}

export {
  createProfile,
  removeProfile
}
