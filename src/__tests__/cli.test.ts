/* eslint-env jest */

import { execSync } from 'child_process'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

// Get package.json data using a function to avoid top-level await
function getPackageJson () {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  return JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'))
}

const pkg = getPackageJson()

describe('CLI', () => {
  test('version command should display correct version information', () => {
    // Run the CLI with the version command
    const output = execSync('node dist/index.js version', { encoding: 'utf8' })

    // Verify the output contains version information and package details
    expect(output).toContain(pkg.name)
    expect(output).toContain(pkg.version)
  })

  test('CLI should show help when no arguments are provided', () => {
    // Run the CLI without any arguments
    const output = execSync('node dist/index.js', { encoding: 'utf8' })

    // Verify the output contains help information
    expect(output).toContain('Usage:')
    expect(output).toContain('Options:')
    expect(output).toContain('Commands:')
    expect(output).toContain('version')
  })
})
