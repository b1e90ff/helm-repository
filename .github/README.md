# Helm Charts CI/CD Pipeline

This repository includes a comprehensive GitHub Actions workflow that automatically validates all Helm charts on every push and pull request.

## Pipeline Overview

The CI pipeline automatically validates all Helm charts:

- **Chart Discovery**: Finds all charts automatically
- **Helm Linting**: Validates chart structure and best practices
- **Template Rendering**: Tests with different namespaces and configurations
- **YAML Validation**: Ensures generated resources are valid Kubernetes objects

## Triggered On

- **Push** to `main` branch only
- **Pull Requests** to any branch (`*`)

## Adding New Charts

The pipeline automatically discovers and tests new charts - no configuration needed!

Just ensure your new chart:
1. Has a valid `Chart.yaml` with name and version
2. Passes `helm lint`
3. Templates render without errors