import { APIHealthResponse, APIProjectDetails, APIGithubOrgDetails, APIChecklistItem, APICheckItem, APIWorkflowItem, APIWorkflowRunItem } from '../types.js'

export const mockApiHealthResponse: APIHealthResponse = {
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '0.1.0-beta3',
  name: 'visionBoard'
}

export const mockAPIProjectResponse: APIProjectDetails = {
  id: 123,
  name: 'Test Project',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  has_defineFunctionalRoles_policy: null,
  has_orgToolingMFA_policy: null,
  has_softwareArchitectureDocs_policy: null,
  has_MFAImpersonationDefense_policy: null,
  has_includeCVEInReleaseNotes_policy: null,
  has_assignCVEForKnownVulns_policy: null,
  has_incidentResponsePlan_policy: null,
  has_regressionTestsForVulns_policy: null,
  has_vulnResponse14Days_policy: null,
  has_useCVDToolForVulns_policy: null,
  has_securityMdMeetsOpenJSCVD_policy: null,
  has_consistentBuildProcessDocs_policy: null,
  has_machineReadableDependencies_policy: null,
  has_identifyModifiedDependencies_policy: null,
  has_ciAndCdPipelineAsCode_policy: null,
  has_npmOrgMFA_policy: null,
  has_npmPublicationMFA_policy: null,
  has_upgradePathDocs_policy: null,
  has_patchNonCriticalVulns90Days_policy: null,
  has_patchCriticalVulns30Days_policy: null,
  has_twoOrMoreOwnersForAccess_policy: null,
  has_injectedSecretsAtRuntime_policy: null,
  has_preventScriptInjection_policy: null,
  has_resolveLinterWarnings_policy: null,
  has_annualDependencyRefresh_policy: null
}

export const mockAPIGithubOrgResponse: APIGithubOrgDetails = {
  id: 456,
  login: 'test-org',
  github_org_id: 789,
  node_id: 'O_kgDOBjYYyw',
  url: 'https://api.github.com/orgs/test-org',
  avatar_url: 'https://avatars.githubusercontent.com/u/12345678?v=4',
  description: 'Test organization for OpenPathfinder',
  name: 'Test Organization',
  company: null,
  blog: 'https://test-org.github.io',
  location: 'Worldwide',
  twitter_username: 'testorg',
  is_verified: true,
  has_organization_projects: true,
  has_repository_projects: true,
  public_repos: 42,
  public_gists: 0,
  followers: 100,
  following: 0,
  html_url: 'https://github.com/test-org',
  total_private_repos: 10,
  owned_private_repos: 10,
  private_gists: 0,
  disk_usage: 1000,
  collaborators: 5,
  default_repository_permission: 'read',
  members_can_create_repositories: true,
  two_factor_requirement_enabled: true,
  members_allowed_repository_creation_type: 'all',
  members_can_create_public_repositories: true,
  members_can_create_private_repositories: true,
  members_can_create_internal_repositories: false,
  members_can_create_pages: true,
  members_can_create_public_pages: true,
  members_can_create_private_pages: true,
  members_can_fork_private_repositories: false,
  web_commit_signoff_required: true,
  deploy_keys_enabled_for_repositories: true,
  dependency_graph_enabled_for_new_repositories: true,
  dependabot_alerts_enabled_for_new_repositories: true,
  dependabot_security_updates_enabled_for_new_repositories: true,
  advanced_security_enabled_for_new_repositories: false,
  secret_scanning_enabled_for_new_repositories: true,
  secret_scanning_push_protection_enabled_for_new_repositories: true,
  secret_scanning_push_protection_custom_link: null,
  secret_scanning_push_protection_custom_link_enabled: false,
  github_created_at: '2020-01-01T00:00:00Z',
  github_updated_at: '2025-06-19T13:48:29Z',
  github_archived_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  project_id: 123
}

export const mockAPIChecklistResponse: APIChecklistItem[] = [{
  id: 123,
  author: 'Ulises Gascón',
  title: 'Test Checklist',
  description: 'Test checklist description',
  code_name: 'test-checklist',
  url: 'https://api.visionboard.example.com/checklist/123',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}]

export const mockAPICheckResponse: APICheckItem[] = [{
  id: 53,
  title: 'Refresh dependencies with annual releases',
  description: 'Ensure dependencies are refreshed through a new release at least once annually',
  default_section_number: '5',
  default_section_name: 'vulnerability management',
  code_name: 'annualDependencyRefresh',
  default_priority_group: 'P14',
  is_c_scrm: true,
  implementation_status: 'completed',
  implementation_type: 'manual',
  implementation_details_reference: 'https://github.com/OpenPathfinder/visionBoard/issues/112',
  details_url: 'https://openpathfinder.com/docs/checks/annualDependencyRefresh',
  created_at: '2025-02-21T18:53:00.485Z',
  updated_at: '2025-02-21T18:53:00.485Z'
}]

export const mockAPIWorkflowResponse: APIWorkflowItem[] = [{
  id: 'update-stuff',
  description: 'Test workflow description',
  isEnabled: true,
  isRequiredAdditionalData: false,
  operations: null,
  schema: null
}]

export const mockAPIWorkflowRunResponse: APIWorkflowRunItem = {
  status: 'completed',
  started: '2025-06-21T10:05:00.000Z',
  finished: '2025-06-21T10:05:02.500Z',
  completed: '2025-06-21T10:05:02.500Z',
  result: { success: true, message: 'Workflow completed successfully' }
}
