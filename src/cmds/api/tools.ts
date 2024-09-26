const randomValue = (length: number) => {
  let result = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export default function apiTools(
  tool: string,
  ...args: string[]
) {
  switch (tool) {
    case "randomValue":
      return randomValue(parseInt(args[0]))
  }

  return null
}
