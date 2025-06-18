import validator from 'validator'

export const getConfig = () => {
  const envUrl = process.env.VISIONBOARD_INSTANCE_URL

  if (envUrl && !validator.isURL(envUrl, {
    require_tld: false,
    require_protocol: true
  })) {
    throw new Error('Invalid environment variable VISIONBOARD_INSTANCE_URL')
  }

  return {
    visionBoardInstanceUrl: envUrl || 'http://localhost:3000'
  }
}
