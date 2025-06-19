import { getConfig } from './utils.js'
import { got } from 'got'
import { APIHealthResponse, APIProjectDetails, APIGithubOrgDetails, APIChecklistItem, APICheckItem } from './types.js'

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
    throw new Error(`Failed to get the data from the API: ${response.statusCode} ${response.body}`)
  }
  return response.body as APIHealthResponse
}

export const createProject = async (name: string): Promise<APIProjectDetails> => {
  const client = apiClient()
  const response = await client.post('project', {
    json: { name },
    responseType: 'json',
    throwHttpErrors: false
  })
  if (response.statusCode === 409) {
    throw new Error(`Project (${name}) already exists`)
  }
  if (response.statusCode !== 201) {
    throw new Error(`Failed to create the project: ${response.statusCode} ${response.body}`)
  }
  return response.body as APIProjectDetails
}

export const addGithubOrgToProject = async (projectId: number, githubOrgUrl: string): Promise<APIGithubOrgDetails> => {
  const client = apiClient()
  const response = await client.post(`project/${projectId}/gh-org`, {
    json: { githubOrgUrl },
    responseType: 'json',
    throwHttpErrors: false
  })
  if (response.statusCode === 409) {
    throw new Error(`GitHub organization (${githubOrgUrl}) already exists in the project`)
  }
  if (response.statusCode === 404) {
    throw new Error(`Project (${projectId}) not found`)
  }
  if (response.statusCode !== 201) {
    throw new Error(`Failed to add the GitHub organization (${githubOrgUrl}) to the project: ${response.statusCode} ${response.body}`)
  }
  return response.body as APIGithubOrgDetails
}

export const getAllChecklistItems = async (): Promise<APIChecklistItem[]> => {
  const client = apiClient()
  const response = await client.get('compliance-checklist', { responseType: 'json' })
  if (response.statusCode !== 200) {
    throw new Error(`Failed to get the data from the API: ${response.statusCode} ${response.body}`)
  }
  return response.body as APIChecklistItem[]
}

export const getAllChecks = async (): Promise<APICheckItem[]> => {
  const client = apiClient()
  const response = await client.get('compliance-check', { responseType: 'json' })
  if (response.statusCode !== 200) {
    throw new Error(`Failed to get the data from the API: ${response.statusCode} ${response.body}`)
  }
  return response.body as APICheckItem[]
}
