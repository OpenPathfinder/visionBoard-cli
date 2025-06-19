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
 * Project endpoint response
 */
export interface APIGithubOrgDetails {
  id: number
  login: string
  github_org_id: number | null
  node_id: string | null
  url: string | null
  avatar_url: string | null
  description: string | null
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  twitter_username: string | null
  is_verified: boolean | null
  has_organization_projects: boolean | null
  has_repository_projects: boolean | null
  public_repos: number | null
  public_gists: number | null
  followers: number | null
  following: number | null
  html_url: string
  total_private_repos: number | null
  owned_private_repos: number | null
  private_gists: number | null
  disk_usage: number | null
  collaborators: number | null
  default_repository_permission: string | null
  members_can_create_repositories: boolean | null
  two_factor_requirement_enabled: boolean | null
  members_allowed_repository_creation_type: string | null
  members_can_create_public_repositories: boolean | null
  members_can_create_private_repositories: boolean | null
  members_can_create_internal_repositories: boolean | null
  members_can_create_pages: boolean | null
  members_can_create_public_pages: boolean | null
  members_can_create_private_pages: boolean | null
  members_can_fork_private_repositories: boolean | null
  web_commit_signoff_required: boolean | null
  deploy_keys_enabled_for_repositories: boolean | null
  dependency_graph_enabled_for_new_repositories: boolean | null
  dependabot_alerts_enabled_for_new_repositories: boolean | null
  dependabot_security_updates_enabled_for_new_repositories: boolean | null
  advanced_security_enabled_for_new_repositories: boolean | null
  secret_scanning_enabled_for_new_repositories: boolean | null
  secret_scanning_push_protection_enabled_for_new_repositories: boolean | null
  secret_scanning_push_protection_custom_link: string | null
  secret_scanning_push_protection_custom_link_enabled: boolean | null
  github_created_at: string | null
  github_updated_at: string | null
  github_archived_at: string | null
  created_at: string
  updated_at: string
  project_id: number
}

/**
 * Project details
 */
export interface APIProjectDetails {
  id: number
  name: string
  created_at: string
  updated_at: string
  has_defineFunctionalRoles_policy: boolean | null
  has_orgToolingMFA_policy: boolean | null
  has_softwareArchitectureDocs_policy: boolean | null
  has_MFAImpersonationDefense_policy: boolean | null
  has_includeCVEInReleaseNotes_policy: boolean | null
  has_assignCVEForKnownVulns_policy: boolean | null
  has_incidentResponsePlan_policy: boolean | null
  has_regressionTestsForVulns_policy: boolean | null
  has_vulnResponse14Days_policy: boolean | null
  has_useCVDToolForVulns_policy: boolean | null
  has_securityMdMeetsOpenJSCVD_policy: boolean | null
  has_consistentBuildProcessDocs_policy: boolean | null
  has_machineReadableDependencies_policy: boolean | null
  has_identifyModifiedDependencies_policy: boolean | null
  has_ciAndCdPipelineAsCode_policy: boolean | null
  has_npmOrgMFA_policy: boolean | null
  has_npmPublicationMFA_policy: boolean | null
  has_upgradePathDocs_policy: boolean | null
  has_patchNonCriticalVulns90Days_policy: boolean | null
  has_patchCriticalVulns30Days_policy: boolean | null
  has_twoOrMoreOwnersForAccess_policy: boolean | null
  has_injectedSecretsAtRuntime_policy: boolean | null
  has_preventScriptInjection_policy: boolean | null
  has_resolveLinterWarnings_policy: boolean | null
  has_annualDependencyRefresh_policy: boolean | null
}

/**
 * Checklist schema
 */
export interface APIChecklistItem {
  id: number
  author: string
  title: string
  description: string
  code_name: string
  url: string
  created_at: string
  updated_at: string
}

/**
 * Check Schema
 */
export type APICheckItem = {
  id: number;
  title: string;
  description: string;
  default_section_number: string;
  default_section_name: string;
  code_name: string;
  default_priority_group: 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8' | 'P9' | 'P10' | 'P11' | 'P12' | 'P13' | 'P14' | 'R0' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9' | 'R10' | 'R11' | 'R12' | 'R13' | 'R14';
  is_c_scrm: boolean;
  implementation_status: 'pending' | 'completed';
  implementation_type: string | null;
  implementation_details_reference: string | null;
  details_url: string;
  created_at: string;
  updated_at: string;
};

/**
 * Error object as defined in the OpenAPI schema
 */
export interface APIErrorObject {
  message: string
  errorCode?: string
  path?: string
  [key: string]: any
}

/**
 * Error response as defined in the OpenAPI schema
 */
export interface APIErrorResponse {
  errors: APIErrorObject[]
  name?: string
  path?: string
  status?: number
  [key: string]: any
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
