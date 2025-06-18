import validator from 'validator'
import { Config, APIHealthResponse } from './types.js'

export const getConfig = (): Config => {
  const envUrl = process.env.VISIONBOARD_INSTANCE_URL

  if (envUrl && !validator.isURL(envUrl, {
    require_tld: false,
    require_protocol: true
  })) {
    throw new Error('Invalid environment variable VISIONBOARD_INSTANCE_URL')
  }

  return {
    visionBoardInstanceUrl: envUrl || 'http://localhost:3000'
  } as Config
}

export const isApiCompatible = (details: APIHealthResponse) => {
  // TODO: Use semantic versioning when API versioning is implemented
  return details.version === '0.1.0-beta3'
}

export const isApiAvailable = (details: APIHealthResponse) => {
  return details.status === 'ok'
}
