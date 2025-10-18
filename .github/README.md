[![Release](https://github.com/b1e90ff/helm-repository/actions/workflows/semantic-release.yml/badge.svg?event=workflow_run)](https://github.com/b1e90ff/helm-repository/actions/workflows/semantic-release.yml)

# Helm Repository

Automated Helm chart repository with CI/CD pipeline.

## CI/CD Pipeline

**Helm CI**: Validates all charts on push/PR
- Helm linting and template rendering
- YAML syntax validation
- Multi-namespace testing

**Semantic Release**: Auto-publishes charts to OCI registry
- Triggered after successful CI
- Conventional commits drive versioning
- Charts publish to GitHub Container Registry

Charts auto-release on main branch using semantic versioning.