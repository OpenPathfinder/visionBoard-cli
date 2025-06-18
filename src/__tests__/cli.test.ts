/* eslint-env jest */

import { execSync } from 'child_process'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get package.json data using a function to avoid top-level await
function getPackageJson () {
  return JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'))
}

const pkg = getPackageJson()

// Helper function to run the CLI using tsx (TypeScript executor)
function runCLI (args = '') {
  return execSync(`tsx ${join(__dirname, '../index.ts')} ${args}`, { encoding: 'utf8' })
}

describe('CLI', () => {
  test('version command should display correct version information', () => {
    // Run the CLI with the version command directly from TypeScript source
    const output = runCLI('version')

    // Verify the output contains version information and package details
    expect(output).toContain(pkg.name)
    expect(output).toContain(pkg.version)
  })

  test('CLI should show help when no arguments are provided', () => {
    // Run the CLI without any arguments directly from TypeScript source
    const output = runCLI('')

    // Verify the output contains help information
    expect(output).toContain('Usage:')
    expect(output).toContain('Options:')
    expect(output).toContain('Commands:')
    expect(output).toContain('version')
  })
})
