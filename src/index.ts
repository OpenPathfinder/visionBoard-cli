#!/usr/bin/env node

import { Command } from 'commander'

import { handleCommandResult } from './utils.js'
import { getVersion, runDoctor } from './cli-commands.js'

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

program.parse(process.argv)
