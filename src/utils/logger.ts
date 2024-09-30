export const logInfo = (message: string, ...args: unknown[]) => {
  console.log(`[INFO] ${message}`, ...args)
}

export const logWarning = (message: string, ...args: unknown[]) => {
  console.warn(`[WARNING] ${message}`, ...args)
}

export const logError = (message: string, ...args: unknown[]) => {
  console.error(`[ERROR] ${message}`, ...args)
}
