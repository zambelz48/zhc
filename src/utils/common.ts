import fs from "node:fs"

interface CreateOptions {
  path: string
  force?: boolean
  recursive?: boolean
}

interface CreateFileOptions extends CreateOptions {
  content?: string
}

const createDirectory = ({
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

const createFile = ({
  path,
  force = false,
  recursive = false,
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

const formatContent = (content: string) => {
  return content.replace(/\/\/.*/g, "")
}

export {
  createDirectory,
  createFile,
  formatContent
}
