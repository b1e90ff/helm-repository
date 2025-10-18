# Istio Sidecar Configurator

Helm chart for automatic Istio sidecar injection configuration.

## Features

- Configures `istio-injection=enabled` label on namespaces
- Works with GitOps-managed namespaces (FluxCD, ArgoCD)
- Pre-install/upgrade hooks for immediate activation
- RBAC configuration for namespace access

## Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `enableIstioInjection` | Enable namespace configuration | `true` |
| `istio.injection` | Istio injection mode (enabled/disabled) | `enabled` |
| `serviceAccount.create` | Create ServiceAccount | `true` |

## How it works

Uses Kubernetes Jobs with pre-install hooks to automatically label the target namespace with Istio injection settings. Includes proper RBAC permissions for namespace patching.