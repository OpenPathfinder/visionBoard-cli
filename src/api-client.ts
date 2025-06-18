import { getConfig } from './utils.js'
import { got } from 'got'
import { APIHealthResponse } from './types.js'

export const apiClient = () => {
  const config = getConfig()
  return got.extend({
    prefixUrl: `${config.visionBoardInstanceUrl}/api/v1`
  })
}

export const getAPIDetails = async (): Promise<APIHealthResponse> => {
  const client = apiClient()
  const response = await client.get('__health', { responseType: 'json' })
  if (response.statusCode !== 200) {
    throw new Error('Failed to get the data from the API')
  }
  return response.body as APIHealthResponse
}
