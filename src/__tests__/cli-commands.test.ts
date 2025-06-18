/* eslint-env jest */

import { getVersion, runDoctor } from '../cli-commands.js'
import { getPackageJson } from '../utils.js'
import { APIHealthResponse } from '../types.js'
import nock from 'nock'

const pkg = getPackageJson()

describe('CLI Commands', () => {
  describe('getVersion', () => {
    it('should return the correct version information', () => {
      const result = getVersion()

      expect(result).toEqual({
        messages: [`Your version is: ${pkg.name}@${pkg.version} (${pkg.license})`],
        success: true
      })
    })

    it('should include the package name, version and license', () => {
      const result = getVersion()
      const message = result.messages[0]

      expect(message).toContain(pkg.name)
      expect(message).toContain(pkg.version)
      expect(message).toContain(pkg.license)
    })
  })

  describe('runDoctor', () => {
    let apiHealthResponse: APIHealthResponse
    beforeEach(() => {
      nock.cleanAll()
      apiHealthResponse = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '0.1.0-beta3',
        name: 'visionBoard'
      }
    })

    it('should return success when API is available and compatible', async () => {
      nock('http://localhost:3000')
        .get('/api/v1/__health')
        .reply(200, apiHealthResponse)

      const result = await runDoctor()

      expect(result.success).toBe(true)
      expect(result.messages).toContain('✅ API is available and compatible')
      expect(result.messages).toHaveLength(1)
    })

    it('should return failure when API is not available (due connection error)', async () => {
      nock('http://localhost:3000')
        .get('/api/v1/__health')
        .reply(500)

      const result = await runDoctor()

      expect(result.success).toBe(false)
      expect(result.messages).toContain('❌ Seems like the API is not available')
      expect(result.messages).toHaveLength(1)
    })

    it('should return failure when API is not available (due internal error)', async () => {
      nock('http://localhost:3000')
        .get('/api/v1/__health')
        .reply(200, { ...apiHealthResponse, status: 'error' })

      const result = await runDoctor()

      expect(result.success).toBe(false)
      expect(result.messages).toContain('❌ Seems like the API is not available')
      expect(result.messages).toHaveLength(1)
    })

    it('should return failure when API version is not compatible', async () => {
      nock('http://localhost:3000')
        .get('/api/v1/__health')
        .reply(200, { ...apiHealthResponse, version: '0.1.0-beta4' })

      const result = await runDoctor()

      expect(result.success).toBe(false)
      expect(result.messages).toContain('❌ API version is not compatible')
      expect(result.messages).toHaveLength(1)
    })
  })
})
