#!/usr/bin/env node

import { Command } from 'commander'
// @ts-ignore
import { stringToArray } from '@ulisesgascon/string-to-array'
import { handleCommandResult, validateData } from './utils.js'
import { getAllWorkflows, getAllBulkImportOperations } from './api-client.js'
import fs from 'fs'
import { getVersion, runDoctor, addProjectWithGithubOrgs, printChecklists, printChecks, printWorkflows, executeWorkflow, printBulkImportOperations, executeBulkImportOperation } from './cli-commands.js'

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

const bulkImport = program
  .command('bulk-import')
  .description('Bulk import management')

bulkImport
  .command('list')
  .description('Print all available bulk import operations')
  .action(async () => {
    const result = await printBulkImportOperations()
    handleCommandResult(result)
  })

bulkImport
  .command('run')
  .description('Run a bulk import operation')
  .requiredOption('-i, --id <id>', 'Bulk import operation ID')
  .option('-d, --data <data>', 'Data to pass to the bulk import operation')
  .option('-f, --file <file>', 'File containing the data to be parsed')
  .action(async (options) => {
    // @TODO: Move to utils and include tests when the backend has one workflow that requires additional data
    const operations = await getAllBulkImportOperations()
    const operation = operations.find((operation) => operation.id === options.id)
    let data: any | undefined
    if (!operation) {
      throw new Error(`Invalid bulk import operation ID (${options.id}). Available operations: ${operations.map(o => o.id).join(', ')}`)
    }

    // Check if workflow requires additional data and if it is provided or requires collection
    if (!options.data && !options.file) {
      throw new Error('Bulk import operation requires additional data. Please provide data using -d or -f option')
    } else if (options.data && options.file) {
      throw new Error('Please provide either -d or -f, not both')
    } else if (options.data) {
      try {
        data = JSON.parse(options.data)
      } catch (error) {
        throw new Error(`Failed to parse provided JSON data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } else if (options.file) {
      try {
        const fileContent = fs.readFileSync(options.file, 'utf-8')
        data = JSON.parse(fileContent)
      } catch (error) {
        throw new Error(`Failed to read or parse file: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    if (!operation.schema) {
      throw new Error('Bulk import operation does not have a JSON schema for data validation. This is an API error')
    }

    // If data is provided, validate against JSON Schema
    if (data && operation.schema) {
      const schema = JSON.parse(operation.schema)
      const result = await validateData(data, schema)
      if (!result.success) {
        throw new Error(`Data validation failed: ${result.messages[0]}`)
      }
    }

    const result = await executeBulkImportOperation(options.id, data)
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
      throw new Error('Workflow requires additional data. Please provide data using -d or -f option')
    } else if (options.data && options.file) {
      throw new Error('Please provide either -d or -f, not both')
    } else if (options.data) {
      try {
        data = JSON.parse(options.data)
      } catch (error) {
        throw new Error(`Failed to parse provided JSON data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } else if (options.file) {
      try {
        const fileContent = fs.readFileSync(options.file, 'utf-8')
        data = JSON.parse(fileContent)
      } catch (error) {
        throw new Error(`Failed to read or parse file: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    if (!workflow.schema && workflow.isRequiredAdditionalData) {
      throw new Error('Workflow does not have a JSON schema. This is an API error')
    }

    // If data is provided, validate against JSON Schema
    if (data && workflow.schema) {
      const schema = JSON.parse(workflow.schema)
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
