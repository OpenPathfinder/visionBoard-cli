/* eslint-env jest */

import { getConfig, isApiCompatible, isApiAvailable } from '../utils.js'
import type { APIHealthResponse } from '../types.js'

const originalEnv = process.env.VISIONBOARD_INSTANCE_URL
let mockResponse: APIHealthResponse

beforeEach(() => {
  delete process.env.VISIONBOARD_INSTANCE_URL
  mockResponse = {
    status: 'ok',
    timestamp: '2025-06-18T16:10:39.000Z',
    version: '0.1.0-beta3',
    name: 'visionboard-api'
  }
})

afterAll(() => {
  if (originalEnv !== undefined) {
    process.env.VISIONBOARD_INSTANCE_URL = originalEnv
  } else {
    delete process.env.VISIONBOARD_INSTANCE_URL
  }
})

describe('Utils', () => {
  describe('getConfig', () => {
    test('should return default config', () => {
      const config = getConfig()
      expect(config.visionBoardInstanceUrl).toBe('http://localhost:3000')
    })

    test('should return config from env', () => {
      process.env.VISIONBOARD_INSTANCE_URL = 'https://visionboard:8080'
      const config = getConfig()
      expect(config.visionBoardInstanceUrl).toBe('https://visionboard:8080')
    })
    test('should throw error for invalid env', () => {
      // missing protocol
      process.env.VISIONBOARD_INSTANCE_URL = 'visionboard:8080'
      expect(() => getConfig()).toThrow('Invalid environment variable VISIONBOARD_INSTANCE_URL')

      // invalid url
      process.env.VISIONBOARD_INSTANCE_URL = 'not-a-url-at-all'

      expect(() => getConfig()).toThrow('Invalid environment variable VISIONBOARD_INSTANCE_URL')
    })
  })

  describe('isApiCompatible', () => {
    test('should return true when API version matches expected version', () => {
      expect(isApiCompatible(mockResponse)).toBe(true)
    })

    test('should return false when API version does not match expected version', () => {
      mockResponse.version = '0.1.0-beta2'
      expect(isApiCompatible(mockResponse)).toBe(false)
    })
  })

  describe('isApiAvailable', () => {
    test('should return true when API status is ok', () => {
      expect(isApiAvailable(mockResponse)).toBe(true)
    })

    test('should return false when API status is not ok', () => {
      mockResponse.status = 'error'
      expect(isApiAvailable(mockResponse)).toBe(false)
    })
  })
})
