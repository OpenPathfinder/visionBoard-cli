/* eslint-env jest */

import { getConfig } from '../utils.js'

const originalEnv = process.env.VISIONBOARD_INSTANCE_URL

beforeEach(() => {
  delete process.env.VISIONBOARD_INSTANCE_URL
})

afterAll(() => {
  if (originalEnv !== undefined) {
    process.env.VISIONBOARD_INSTANCE_URL = originalEnv
  } else {
    delete process.env.VISIONBOARD_INSTANCE_URL
  }
})

describe('Utils', () => {
  test('getConfig should return default config', () => {
    const config = getConfig()
    expect(config.visionBoardInstanceUrl).toBe('http://localhost:3000')
  })

  test('getConfig should return config from env', () => {
    process.env.VISIONBOARD_INSTANCE_URL = 'https://visionboard:8080'
    const config = getConfig()
    expect(config.visionBoardInstanceUrl).toBe('https://visionboard:8080')
  })

  test('getConfig should throw error for invalid env', () => {
    // missing protocol
    process.env.VISIONBOARD_INSTANCE_URL = 'visionboard:8080'
    expect(() => getConfig()).toThrow('Invalid environment variable VISIONBOARD_INSTANCE_URL')

    // invalid url
    process.env.VISIONBOARD_INSTANCE_URL = 'not-a-url-at-all'

    expect(() => getConfig()).toThrow('Invalid environment variable VISIONBOARD_INSTANCE_URL')
  })
})
