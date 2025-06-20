/* eslint-env jest */

import { getVersion, runDoctor, addProjectWithGithubOrgs, printChecklists, printChecks, printWorkflows } from '../cli-commands.js'
import { getPackageJson } from '../utils.js'
import { APIHealthResponse, APIProjectDetails, APIGithubOrgDetails, APIErrorResponse, APIChecklistItem, APICheckItem, APIWorkflowItem } from '../types.js'
import { mockApiHealthResponse, mockAPIProjectResponse, mockAPIGithubOrgResponse, mockAPIChecklistResponse, mockAPICheckResponse, mockAPIWorkflowResponse } from './fixtures.js'
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
      apiHealthResponse = mockApiHealthResponse
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

  describe('addProjectWithGithubOrgs', () => {
    let mockProject: APIProjectDetails
    let mockGithubOrg1: APIGithubOrgDetails
    let mockGithubOrg2: APIGithubOrgDetails

    beforeEach(() => {
      nock.cleanAll()

      // Setup mock project data using fixtures
      mockProject = { ...mockAPIProjectResponse }

      // Create simplified GitHub org responses for tests
      mockGithubOrg1 = { ...mockAPIGithubOrgResponse }

      mockGithubOrg2 = {
        ...mockAPIGithubOrgResponse,
        id: 789,
        name: 'org2',
        login: 'org2'
      }
    })

    it('should create a project and add GitHub organizations successfully', async () => {
      // Mock API calls
      nock('http://localhost:3000')
        .post('/api/v1/project', { name: 'Test Project' })
        .reply(201, mockProject)

      nock('http://localhost:3000')
        .post('/api/v1/project/123/gh-org', { githubOrgUrl: 'https://github.com/org1' })
        .reply(201, mockGithubOrg1)

      nock('http://localhost:3000')
        .post('/api/v1/project/123/gh-org', { githubOrgUrl: 'https://github.com/org2' })
        .reply(201, mockGithubOrg2)

      // Execute the function
      const result = await addProjectWithGithubOrgs('Test Project', [
        'https://github.com/org1',
        'https://github.com/org2'
      ])

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.messages).toContain('✅ Project created successfully')
      expect(result.messages).toHaveLength(1)
      expect(nock.isDone()).toBe(true) // Verify all mocked endpoints were called
    })

    it('should handle failure when project creation fails', async () => {
      // Mock failed project creation
      nock('http://localhost:3000')
        .post('/api/v1/project', { name: 'Existing Project' })
        .reply(409, { errors: [{ message: 'Project already exists' }] } as APIErrorResponse)

      // Execute the function
      const result = await addProjectWithGithubOrgs('Existing Project', [
        'https://github.com/org1'
      ])

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.messages[0]).toContain('❌ Failed to create the project')
      expect(result.messages[0]).toContain('Project (Existing Project) already exists')
      expect(result.messages).toHaveLength(1)
    })

    it('should handle failure when adding GitHub organization fails', async () => {
      // Mock API calls
      nock('http://localhost:3000')
        .post('/api/v1/project', { name: 'Test Project' })
        .reply(201, mockProject)

      // Mock failed GitHub org addition (already exists)
      nock('http://localhost:3000')
        .post('/api/v1/project/123/gh-org', { githubOrgUrl: 'https://github.com/existing-org' })
        .reply(409, { errors: [{ message: 'GitHub organization already exists in the project' }] } as APIErrorResponse)

      // Execute the function
      const result = await addProjectWithGithubOrgs('Test Project', [
        'https://github.com/existing-org'
      ])

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.messages[0]).toContain('❌ Failed to create the project')
      expect(result.messages[0]).toContain('GitHub organization (https://github.com/existing-org) already exists in the project')
      expect(result.messages).toHaveLength(1)
    })
  })

  describe('printChecklists', () => {
    let mockChecklists: APIChecklistItem[]

    beforeEach(() => {
      nock.cleanAll()
      mockChecklists = [...mockAPIChecklistResponse]
    })

    it('should retrieve and format checklist items successfully', async () => {
      // Mock API call
      nock('http://localhost:3000')
        .get('/api/v1/compliance-checklist')
        .reply(200, mockChecklists)

      // Execute the function
      const result = await printChecklists()

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.messages[0]).toBe('Compliance checklists:')
      expect(result.messages[1]).toContain(mockChecklists[0].title)
      expect(result.messages[1]).toContain(mockChecklists[0].code_name)
      expect(result.messages[1]).toContain(mockChecklists[0].description)
      expect(result.messages[1]).toContain(mockChecklists[0].url)
      expect(result.messages).toHaveLength(2) // Header + 1 checklist item
      expect(nock.isDone()).toBe(true) // Verify all mocked endpoints were called
    })

    it('should handle multiple checklist items', async () => {
      // Add a second checklist item
      const secondChecklist = {
        ...mockChecklists[0],
        id: 456,
        title: 'Second Checklist',
        code_name: 'second-checklist',
        description: 'Another checklist description',
        url: 'https://api.visionboard.example.com/checklist/456'
      }
      mockChecklists.push(secondChecklist)

      // Mock API call
      nock('http://localhost:3000')
        .get('/api/v1/compliance-checklist')
        .reply(200, mockChecklists)

      // Execute the function
      const result = await printChecklists()

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.messages[0]).toBe('Compliance checklists:')
      expect(result.messages[1]).toContain(mockChecklists[0].title)
      expect(result.messages[2]).toContain(mockChecklists[1].title)
      expect(result.messages).toHaveLength(3) // Header + 2 checklist items
    })

    it('should handle API errors gracefully', async () => {
      // Mock API error
      nock('http://localhost:3000')
        .get('/api/v1/compliance-checklist')
        .reply(500, { errors: [{ message: 'Internal server error' }] } as APIErrorResponse)

      // Execute the function
      const result = await printChecklists()

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.messages[0]).toContain('❌ Failed to retrieve compliance checklist items')
      expect(result.messages).toHaveLength(1)
    })

    it('should handle network errors gracefully', async () => {
      // Mock network error
      nock('http://localhost:3000')
        .get('/api/v1/compliance-checklist')
        .replyWithError('Network error')

      // Execute the function
      const result = await printChecklists()

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.messages[0]).toContain('❌ Failed to retrieve compliance checklist items')
      expect(result.messages[0]).toContain('Network error')
      expect(result.messages).toHaveLength(1)
    })

    it('should handle empty checklist response', async () => {
      // Mock empty response
      nock('http://localhost:3000')
        .get('/api/v1/compliance-checklist')
        .reply(200, [])

      // Execute the function
      const result = await printChecklists()

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.messages).toHaveLength(1) // Only the header message
      expect(result.messages[0]).toBe('No compliance checklists found')
    })
  })

  describe('printChecks', () => {
    let mockChecks: APICheckItem[]

    beforeEach(() => {
      nock.cleanAll()
      mockChecks = [...mockAPICheckResponse]
    })

    it('should retrieve and format check items successfully', async () => {
      // Mock API call
      nock('http://localhost:3000')
        .get('/api/v1/compliance-check')
        .reply(200, mockChecks)

      // Execute the function
      const result = await printChecks()

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.messages[0]).toBe('Compliance checks available:')
      expect(result.messages[1]).toContain(mockChecks[0].code_name)
      expect(result.messages[1]).toContain(mockChecks[0].description)
      expect(result.messages[1]).toContain(mockChecks[0].details_url)
      expect(result.messages).toHaveLength(2) // Header + 1 check item
      expect(nock.isDone()).toBe(true) // Verify all mocked endpoints were called
    })

    it('should handle multiple check items', async () => {
      // Add a second check item
      const secondCheck = {
        ...mockChecks[0],
        id: 456,
        title: 'Second Check',
        code_name: 'secondCheck',
        description: 'Another check description',
        details_url: 'https://openpathfinder.com/docs/checks/secondCheck'
      }
      mockChecks.push(secondCheck)

      // Mock API call
      nock('http://localhost:3000')
        .get('/api/v1/compliance-check')
        .reply(200, mockChecks)

      // Execute the function
      const result = await printChecks()

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.messages[0]).toBe('Compliance checks available:')
      expect(result.messages[1]).toContain(mockChecks[0].code_name)
      expect(result.messages[2]).toContain(mockChecks[1].code_name)
      expect(result.messages).toHaveLength(3) // Header + 2 check items
    })

    it('should handle API errors gracefully', async () => {
      // Mock API error
      nock('http://localhost:3000')
        .get('/api/v1/compliance-check')
        .reply(500, { errors: [{ message: 'Internal server error' }] } as APIErrorResponse)

      // Execute the function
      const result = await printChecks()

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.messages[0]).toContain('❌ Failed to retrieve compliance check items')
      expect(result.messages).toHaveLength(1)
    })

    it('should handle network errors gracefully', async () => {
      // Mock network error
      nock('http://localhost:3000')
        .get('/api/v1/compliance-check')
        .replyWithError('Network error')

      // Execute the function
      const result = await printChecks()

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.messages[0]).toContain('❌ Failed to retrieve compliance check items')
      expect(result.messages[0]).toContain('Network error')
      expect(result.messages).toHaveLength(1)
    })

    it('should handle empty check response', async () => {
      // Mock empty response
      nock('http://localhost:3000')
        .get('/api/v1/compliance-check')
        .reply(200, [])

      // Execute the function
      const result = await printChecks()

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.messages).toHaveLength(1) // Only the header message
      expect(result.messages[0]).toBe('No compliance checks found')
    })
  })

  describe('printWorkflows', () => {
    let mockWorkflows: APIWorkflowItem[]

    beforeEach(() => {
      nock.cleanAll()
      mockWorkflows = [...mockAPIWorkflowResponse]
    })

    it('should retrieve and format workflow items successfully', async () => {
      // Mock API call
      nock('http://localhost:3000')
        .get('/api/v1/workflow')
        .reply(200, mockWorkflows)

      // Execute the function
      const result = await printWorkflows()

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.messages[0]).toBe('Compliance workflows available:')
      expect(result.messages[1]).toContain(mockWorkflows[0].id)
      expect(result.messages[1]).toContain(mockWorkflows[0].description)
      expect(result.messages).toHaveLength(2) // Header + 1 workflow item
      expect(nock.isDone()).toBe(true) // Verify all mocked endpoints were called
    })

    it('should handle multiple workflow items', async () => {
      // Add a second workflow item
      const secondWorkflow = {
        ...mockWorkflows[0],
        id: 'create-stuff',
        description: 'Another workflow description'
      }
      mockWorkflows.push(secondWorkflow)

      // Mock API call
      nock('http://localhost:3000')
        .get('/api/v1/workflow')
        .reply(200, mockWorkflows)

      // Execute the function
      const result = await printWorkflows()

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.messages[0]).toBe('Compliance workflows available:')
      expect(result.messages[1]).toContain(mockWorkflows[0].id)
      expect(result.messages[2]).toContain(mockWorkflows[1].id)
      expect(result.messages).toHaveLength(3) // Header + 2 workflow items
    })

    it('should handle disabled workflows', async () => {
      // Add a second workflow item
      const secondWorkflow = {
        ...mockWorkflows[0],
        id: 'create-stuff',
        description: 'Another workflow description',
        isEnabled: false
      }
      mockWorkflows.push(secondWorkflow)

      // Mock API call
      nock('http://localhost:3000')
        .get('/api/v1/workflow')
        .reply(200, mockWorkflows)

      // Execute the function
      const result = await printWorkflows()

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.messages[0]).toBe('Compliance workflows available:')
      expect(result.messages[1]).toContain(mockWorkflows[0].id)
      expect(result.messages[1]).toContain(mockWorkflows[0].description)
      expect(result.messages).toHaveLength(2) // Header + 1 enabled workflow item
    })

    it('should handle API errors gracefully', async () => {
      // Mock API error
      nock('http://localhost:3000')
        .get('/api/v1/workflow')
        .reply(500, { errors: [{ message: 'Internal server error' }] } as APIErrorResponse)

      // Execute the function
      const result = await printWorkflows()

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.messages[0]).toContain('❌ Failed to retrieve compliance workflow items')
      expect(result.messages).toHaveLength(1)
    })

    it('should handle network errors gracefully', async () => {
      // Mock network error
      nock('http://localhost:3000')
        .get('/api/v1/workflow')
        .replyWithError('Network error')

      // Execute the function
      const result = await printWorkflows()

      // Verify the result
      expect(result.success).toBe(false)
      expect(result.messages[0]).toContain('❌ Failed to retrieve compliance workflow items')
      expect(result.messages[0]).toContain('Network error')
      expect(result.messages).toHaveLength(1)
    })

    it('should handle empty workflow response', async () => {
      // Mock empty response
      nock('http://localhost:3000')
        .get('/api/v1/workflow')
        .reply(200, [])

      // Execute the function
      const result = await printWorkflows()

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.messages).toHaveLength(1) // Only the header message
      expect(result.messages[0]).toBe('No compliance workflows found')
    })
  })
})
