/**
 * API response types for visionBoard API
 */

/**
 * Health endpoint response
 */
export interface APIHealthResponse {
  status: string
  timestamp: string
  version: string
  name: string
}

/**
 * Configuration interface for visionBoard CLI
 */
export interface Config {
  visionBoardInstanceUrl: string
}

export interface CommandResult {
  messages: string[]
  success: boolean
}
