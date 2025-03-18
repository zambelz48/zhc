
export const spacer = (length: number = 1) => {
  return "  ".repeat(length)
}

export const parseContent = (content: string): {
  unparseable: {line: number, value: string}[],
  parsed: Record<string, any>
}=> {
  try {
    const splitedContent = content.split("\n")
    const unparseableContent: { line: number, value: string }[] = []

    let parseableContent = ""

    for (let i=0; i<splitedContent.length; i++) {
      const line = splitedContent[i]
      if (line.trim() === "") {
        unparseableContent.push({ line: i, value: "\n" })
        continue
      }

      if (line.trim().startsWith("//")) {
        unparseableContent.push({ line: i, value: line })
        continue
      }
      parseableContent += line
    }

    return {
      unparseable: unparseableContent,
      parsed: JSON.parse(parseableContent)
    }
  } catch (e) {
    throw new Error(`Failed to parse content: ${content}\nError: ${e}`)
  }
}
