import fs from "node:fs"
import { execSync } from "node:child_process"

interface CreateOptions {
  path: string
  force?: boolean
  recursive?: boolean
}

interface CreateFileOptions extends CreateOptions {
  content?: string
}

export const createDirectory = ({
  path,
  force = false,
  recursive = false
}: CreateOptions) => {
  if (!force && fs.existsSync(path)) {
    throw new Error(`"${path}" is exists`)
  }

  if (force && fs.existsSync(path)) {
    fs.rmdirSync(path, { recursive: true })
  }

  fs.mkdirSync(path, { recursive })

  if (!fs.existsSync(path)) {
    throw new Error(`Failed to create "${path}"`)
  }
}

export const createFile = ({
  path,
  force = false,
  content = ""
}: CreateFileOptions) => {
  if (!force && fs.existsSync(path)) {
    throw new Error(`"${path}" is exists`)
  }

  if (force && fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true })
  }

  fs.writeFileSync(path, content)

  if (!fs.existsSync(path)) {
    throw new Error(`Failed to create "${path}"`)
  }
}

export const fileLists = (filePath: string) => {
  return fs.readdirSync(filePath)
}

export const removeFileExtension = (name: string) => {
  return name.split(".")[0]
}

export const isDirectory = (filePath: string) => {
  return fs.lstatSync(filePath).isDirectory()
}

export const isFileExecutable = (filePath: string) => {
  return execSync(`ls -l ${filePath} | awk '{ print $1 }'`)
    .toString()
    .charAt(3) === "x"
}
