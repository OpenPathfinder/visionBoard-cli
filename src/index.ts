#!/usr/bin/env node

import { Command } from 'commander'
// @ts-ignore
import { stringToArray } from '@ulisesgascon/string-to-array'
import { handleCommandResult } from './utils.js'
import { getVersion, runDoctor, addProjectWithGithubOrgs, printChecklists } from './cli-commands.js'

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
