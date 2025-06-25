#!/bin/bash

# Set environment variables for configuration
export VISIONBOARD_INSTANCE_URL=http://localhost:3000

# Step 1: Verify environment and connectivity
echo "=== Verifying environment and connectivity ==="
visionboard version
visionboard doctor

# Step 2: List available resources
echo "\n=== Listing available resources ==="
visionboard workflow list
visionboard compliance-check list
visionboard compliance-checklist list
visionboard bulk-import list

# Step 3: Project setup
echo "\n=== Setting up project ==="
visionboard project add -n express -g https://github.com/expressjs

# Step 4: Execute workflows
echo "\n=== Executing workflows ==="
visionboard workflow execute -w update-github-orgs
visionboard workflow execute -w run-all-checks

# Step 5: Execute workflow with inline JSON data
echo "\n=== Executing workflow with inline JSON data ==="
visionboard workflow execute -w run-one-check -d '{"check_name": "softwareArchitectureDocs"}'

# Step 6: Execute workflow with JSON data from file
echo "\n=== Executing workflow with JSON data from file ==="
cat > ./manual-check.json << EOF
{
  "check_name": "softwareArchitectureDocs"
}
EOF
visionboard workflow execute -w run-one-check -f ./manual-check.json

# Step 7: Bulk import with inline JSON data
echo "\n=== Performing bulk import with inline JSON data ==="
visionboard bulk-import run -i load-manual-checks -d '[
  { 
    "type": "annualDependencyRefresh", 
    "project_id": 1, 
    "is_subscribed": true 
  }
]'

# Step 8: Bulk import with JSON data from file
echo "\n=== Performing bulk import with JSON data from file ==="
cat > ./import.json << EOF
[
  {
    "type": "annualDependencyRefresh", 
    "project_id": 1, 
    "is_subscribed": true 
  }
]
EOF
visionboard bulk-import run -i load-manual-checks -f ./import.json

echo "\n=== Script execution completed ==="