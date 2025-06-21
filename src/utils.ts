import validator from 'validator'
import { Config, APIHealthResponse, CommandResult } from './types.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

// Use type assertions to bypass TypeScript errors
// @TODO: Remove type assertions when ajv-formats is updated
const ajv = new (Ajv as any)()
;(addFormats as any)(ajv)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const getPackageJson = () => {
  return JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))
}

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

export const handleCommandResult = (result: CommandResult) => {
  if (result.success) {
    console.log(result.messages.join('\n'))
  } else {
    console.error(result.messages.join('\n'))
    process.exit(1)
  }
}

export const validateData = (data: any, schema: any) => {
  const validate = ajv.compile(schema)
  const valid = validate(data)
  if (!valid) {
    return {
      success: false,
      messages: validate.errors?.map((error: any) => error.message) || []
    }
  }
  return {
    success: true,
    messages: []
  }
}
