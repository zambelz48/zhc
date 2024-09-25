import { createProfile, removeProfile } from "../../utils/profile"

const createNewProfile = (opt: Record<string, string | boolean>) => {
  const profileName = opt?.add as string
  if (!profileName) {
    console.error("Profile name is required")
    return
  }

  try {
    const newProfile = createProfile(profileName)
    console.log("New profile created at: ", newProfile)
  } catch (err) {
    console.error(err)
  }
}

const removeRegisteredProfile = (opt: Record<string, string | boolean>) => {
  const profileName = opt?.add as string
  if (!profileName) {
    console.error("Profile name is required")
    return
  }

  try {
    removeProfile(profileName)
    console.log(`Profile "${profileName}" has been removed`)
  } catch (err) {
    console.error(err)
  }
}

export {
  createNewProfile,
  removeRegisteredProfile
}
