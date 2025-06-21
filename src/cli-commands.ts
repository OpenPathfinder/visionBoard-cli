import { CommandResult } from './types.js'
import { isApiAvailable, isApiCompatible, getPackageJson } from './utils.js'
import { getAPIDetails, createProject, addGithubOrgToProject, getAllChecklistItems, getAllChecks, getAllWorkflows, runWorkflow } from './api-client.js'

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

export const printChecklists = async (): Promise<CommandResult> => {
  const messages: string[] = []
  let success = true
  try {
    const checklists = await getAllChecklistItems()
    if (checklists.length === 0) {
      messages.push('No compliance checklists found')
      return {
        messages,
        success
      }
    }
    messages.push('Compliance checklists:')
    checklists.forEach((checklist) => {
      messages.push(`- ${checklist.title} (${checklist.code_name}): ${checklist.description}. Docs: ${checklist.url}`)
    })
  } catch (error) {
    messages.push(`❌ Failed to retrieve compliance checklist items: ${error instanceof Error ? error.message : 'Unknown error'}`)
    success = false
  }

  return {
    messages,
    success
  }
}

export const printChecks = async (): Promise<CommandResult> => {
  const messages: string[] = []
  let success = true
  try {
    const checks = await getAllChecks()
    if (checks.length === 0) {
      messages.push('No compliance checks found')
      return {
        messages,
        success
      }
    }
    messages.push('Compliance checks available:')
    checks.forEach((check) => {
      messages.push(`- ${check.code_name}: ${check.description}. ${check.details_url}`)
    })
  } catch (error) {
    messages.push(`❌ Failed to retrieve compliance check items: ${error instanceof Error ? error.message : 'Unknown error'}`)
    success = false
  }

  return {
    messages,
    success
  }
}

export const printWorkflows = async (): Promise<CommandResult> => {
  const messages: string[] = []
  let success = true
  try {
    const workflows = await getAllWorkflows()
    if (workflows.length === 0) {
      messages.push('No compliance workflows found')
      return {
        messages,
        success
      }
    }
    messages.push('Compliance workflows available:')
    workflows.forEach((workflow) => {
      if (workflow.isEnabled) {
        messages.push(`- ${workflow.id}: ${workflow.description}`)
      }
    })
  } catch (error) {
    messages.push(`❌ Failed to retrieve compliance workflow items: ${error instanceof Error ? error.message : 'Unknown error'}`)
    success = false
  }

  return {
    messages,
    success
  }
}

export const executeWorkflow = async (workflowId: string, data: any): Promise<CommandResult> => {
  const messages: string[] = []
  let success = true
  try {
    const results = await runWorkflow(workflowId, data)
    const startTime = new Date(results.started)
    const endTime = new Date(results.finished)
    const duration = endTime.getTime() - startTime.getTime()
    const durationStr = duration < 1000 ? `${duration} ms` : `${(duration / 1000).toFixed(2)} seconds`

    messages.push(`Workflow executed ${results.result.success ? 'successfully' : 'unsuccessfully'} in ${durationStr}`)
    messages.push(`- Status: ${results.status}`)
    messages.push(`- Started: ${startTime}`)
    messages.push(`- Finished: ${endTime}`)
    messages.push(`- Result: ${results.result.message}`)
  } catch (error) {
    messages.push(`❌ Failed to execute the workflow: ${error instanceof Error ? error.message : 'Unknown error'}`)
    success = false
  }

  return {
    messages,
    success
  }
}
