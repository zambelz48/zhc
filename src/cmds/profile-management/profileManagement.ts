import { logError, logInfo } from "../../utils/logger"
import { createProfile, removeProfile } from "../../utils/profile"

const createNewProfile = (opt: Record<string, string | boolean>) => {
  const profileName = opt?.add as string
  if (!profileName) {
    logError("Profile name is required")
    return
  }

  try {
    const newProfile = createProfile(profileName)
    logInfo("New profile created at: ", newProfile)
  } catch (err) {
    logError(`${err}`)
  }
}

const removeRegisteredProfile = (opt: Record<string, string | boolean>) => {
  const profileName = opt?.remove as string
  if (!profileName) {
    logError("Profile name is required")
    return
  }

  try {
    removeProfile(profileName)
    console.log(`Profile "${profileName}" has been removed`)
  } catch (err) {
    logError(`${err}`)
  }
}

export {
  createNewProfile,
  removeRegisteredProfile
}
