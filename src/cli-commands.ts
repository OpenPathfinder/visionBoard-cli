import { CommandResult } from './types.js'
import { isApiAvailable, isApiCompatible, getPackageJson } from './utils.js'
import { getAPIDetails, createProject, addGithubOrgToProject } from './api-client.js'

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

export const addProjectWithGithubOrgs = async (name: string, githubOrgUrls: string[]): Promise<CommandResult> => {
  const messages: string[] = []
  let success = true
  try {
    const project = await createProject(name)
    // Add GitHub organizations sequentially to avoid race conditions
    for (const githubOrgUrl of githubOrgUrls) {
      await addGithubOrgToProject(project.id, githubOrgUrl)
    }
    messages.push('✅ Project created successfully')
  } catch (error) {
    messages.push(`❌ Failed to create the project: ${error instanceof Error ? error.message : 'Unknown error'}`)
    success = false
  }

  return {
    messages,
    success
  }
}
