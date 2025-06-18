#!/usr/bin/env node

import { Command } from 'commander'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))

const program = new Command()

program
  .command('version')
  .description('Show version information')
  .action(() => {
    console.log(`Your version is: ${pkg.name}@${pkg.version} (${pkg.license})`)
  })

// Show help if no arguments provided
if (process.argv.length <= 2) {
  program.help()
} else {
  program.parse(process.argv)
}
