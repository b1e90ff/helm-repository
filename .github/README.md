[![Release](https://github.com/b1e90ff/helm-repository/actions/workflows/semantic-release.yml/badge.svg?event=workflow_run)](https://github.com/b1e90ff/helm-repository/actions/workflows/semantic-release.yml)
# Helm Charts Repository

Automated Helm chart releases with semantic versioning.

## Charts

- **istio-gateway**: Istio Gateway configuration
- **istio-sidecar-configurator**: Automatic Istio sidecar injection

## Usage

### Conventional Commits
- `feat(chart):` → Minor version
- `fix(chart):` → Patch version  
- `feat(chart)!:` → Major version

### Setup New Chart
```bash
npm run setup
```

Charts release automatically on main branch based on commit changes.