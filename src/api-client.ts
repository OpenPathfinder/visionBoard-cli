import { getConfig } from './utils.js'
import { got } from 'got'
import { APIHealthResponse, APIProjectDetails, APIGithubOrgDetails, APIChecklistItem, APICheckItem, APIWorkflowItem, APIOperationCompleted, APIBulkImportOperationItem } from './types.js'

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

export const getAllWorkflows = async (): Promise<APIWorkflowItem[]> => {
  const client = apiClient()
  const response = await client.get('workflow', { responseType: 'json' })
  if (response.statusCode !== 200) {
    throw new Error(`Failed to get the data from the API: ${response.statusCode} ${response.body}`)
  }
  return response.body as APIWorkflowItem[]
}

export const runWorkflow = async (workflowId: string, data: any): Promise<APIOperationCompleted> => {
  const client = apiClient()
  const payload = data ? { data } : {}
  const response = await client.post(`workflow/${workflowId}/execute`, {
    json: payload,
    responseType: 'json'
  })
  if (response.statusCode !== 202) {
    throw new Error(`Failed to run the workflow: ${response.statusCode} ${response.body}`)
  }
  return response.body as APIOperationCompleted
}

export const getAllBulkImportOperations = async (): Promise<APIBulkImportOperationItem[]> => {
  const client = apiClient()
  const response = await client.get('bulk-import', { responseType: 'json' })
  if (response.statusCode !== 200) {
    throw new Error(`Failed to get the data from the API: ${response.statusCode} ${response.body}`)
  }
  return response.body as APIBulkImportOperationItem[]
}

export const runBulkImportOperation = async (id: string, payload: any): Promise<APIOperationCompleted> => {
  const client = apiClient()
  const response = await client.post('bulk-import', {
    json: { id, payload },
    responseType: 'json',
    throwHttpErrors: false
  })

  if (response.statusCode <= 500 && response.statusCode >= 400) {
    throw new Error(`Failed to run the bulk import operation: ${response.statusCode} ${JSON.stringify(response.body, null, 2)}`)
  }

  return response.body as APIOperationCompleted
}
