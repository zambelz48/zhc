
export const spacer = (length: number = 1) => {
  return "  ".repeat(length)
}

export const formatContent = (content: string) => {
  return content.replace(/\/\/.*/g, "")
}

