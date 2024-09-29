export const logInfo = (message: string, ...args: unknown[]) => {
  console.log()
  console.log(`[INFO] ${message}`, ...args)
  console.log()
}

export const logWarning = (message: string, ...args: unknown[]) => {
  console.log()
  console.warn(`[WARNING] ${message}`, ...args)
  console.log()
}

export const logError = (message: string, ...args: unknown[]) => {
  console.log()
  console.error(`[ERROR] ${message}`, ...args)
  console.log()
}
