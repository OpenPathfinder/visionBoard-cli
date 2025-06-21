#!/usr/bin/env node

import { Command } from 'commander'
// @ts-ignore
import { stringToArray } from '@ulisesgascon/string-to-array'
import { handleCommandResult, validateData } from './utils.js'
import { getAllWorkflows } from './api-client.js'
import fs from 'fs'
import { getVersion, runDoctor, addProjectWithGithubOrgs, printChecklists, printChecks, printWorkflows, executeWorkflow } from './cli-commands.js'

const program = new Command()

program
  .name('visionboard')
  .command('version')
  .description('Show version information')
  .action(() => handleCommandResult(getVersion()))

program
  .command('doctor')
  .description('Check compatibility and availability with the API')
  .action(async () => {
    console.log('Checking API availability...')
    const result = await runDoctor()
    handleCommandResult(result)
  })

const workflow = program
  .command('workflow')
  .description('Compliance workflow management')

workflow
  .command('list')
  .description('Print all available compliance workflows')
  .action(async () => {
    const result = await printWorkflows()
    handleCommandResult(result)
  })

workflow
  .command('execute')
  .description('Execute a compliance workflow')
  .requiredOption('-w, --workflow <workflowName>', 'Workflow name')
  .option('-d, --data <data>', 'Data to pass to the workflow')
  .option('-f, --file <file>', 'File containing the data to be parsed')
  .action(async (options) => {
    // @TODO: Move to utils and include tests when the backend has one workflow that requires additional data
    const workflows = await getAllWorkflows()
    const workflow = workflows.find((workflow) => workflow.id === options.workflow)
    let data: any | undefined
    if (!workflow) {
      throw new Error(`Invalid workflow name (${options.workflow}). Available workflows: ${workflows.map(w => w.id).join(', ')}`)
    }
    if (!workflow.isEnabled) {
      throw new Error('Workflow is not enabled')
    }
    // Check if workflow requires additional data and if it is provided or requires collection
    if (workflow.isRequiredAdditionalData && (!options.data && !options.file)) {
      throw new Error('Workflow does not require additional data. Please remove -d or -f options')
    } else if (options.data && options.file) {
      throw new Error('Please provide either -d or -f, not both')
    } else if (options.data) {
      data = options.data
    } else if (options.file) {
      data = JSON.parse(fs.readFileSync(options.file, 'utf-8'))
    }

    // If data is provided, validate against JSON Schema
    if (data) {
      const schema = workflow.schema
      if (!schema) {
        throw new Error('Workflow does not have a JSON schema')
      }
      const result = await validateData(data, schema)
      if (!result.success) {
        throw new Error(`Data validation failed: ${result.messages[0]}`)
      }
    }

    const result = await executeWorkflow(options.workflow, data)
    handleCommandResult(result)
  })

const checklist = program
  .command('compliance-checklist')
  .description('Compliance checklist management')

checklist
  .command('list')
  .description('Print all available compliance checklists')
  .action(async () => {
    const result = await printChecklists()
    handleCommandResult(result)
  })

const check = program
  .command('compliance-check')
  .description('Compliance check management')

check
  .command('list')
  .description('Print all available compliance checks')
  .action(async () => {
    const result = await printChecks()
    handleCommandResult(result)
  })

const project = program
  .command('project')
  .description('Project management')

project
  .command('add')
  .description('Add a project with a list of GitHub organizations (optional)')
  .requiredOption('-n, --name <name>', 'Project name')
  .option('-g, --github-orgs <githubOrgUrls...>', 'GitHub organization URLs')
  .action(async (options) => {
    const githubOrgs = options.githubOrgs ? stringToArray(options.githubOrgs[0]) : []
    const result = await addProjectWithGithubOrgs(options.name, githubOrgs)
    handleCommandResult(result)
  })

program.parse(process.argv)
