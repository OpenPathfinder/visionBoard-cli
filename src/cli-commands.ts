import { CommandResult } from './types.js'
import { isApiAvailable, isApiCompatible, getPackageJson } from './utils.js'
import { getAPIDetails } from './api-client.js'

const pkg = getPackageJson()

export const getVersion = (): CommandResult => {
  return {
    messages: [`Your version is: ${pkg.name}@${pkg.version} (${pkg.license})`],
    success: true
  }
}

export const runDoctor = async (): Promise<CommandResult> => {
  const messages: string[] = []
  let success = true
  try {
    const details = await getAPIDetails()

    if (!isApiAvailable(details)) {
      messages.push('❌ Seems like the API is not available')
      success = false
    } else if (!isApiCompatible(details)) {
      messages.push('❌ API version is not compatible')
      success = false
    } else {
      messages.push('✅ API is available and compatible')
    }
  } catch (error) {
    messages.push('❌ Seems like the API is not available')
    success = false
  }

  return {
    messages,
    success
  }
}
