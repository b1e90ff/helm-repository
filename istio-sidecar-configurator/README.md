# Istio Sidecar Configurator

A Helm chart to configure Istio sidecar injection for existing namespaces.

## What it does

Configures the `istio-injection=enabled` label on namespaces that were created by GitOps tools like FluxCD.

## Installation

```bash
helm install istio-sidecar-configurator ./istio-sidecar-configurator --namespace your-namespace
```

## Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `enableIstioInjection` | Enable namespace configuration | `true` |
| `istio.injection` | Istio injection mode (enabled/disabled) | `enabled` |
| `serviceAccount.create` | Create ServiceAccount | `true` |

## Usage

```bash
# Enable Istio injection (default)
helm install istio-sidecar-configurator ./istio-sidecar-configurator --namespace my-app

# Disable Istio injection
helm install istio-sidecar-configurator ./istio-sidecar-configurator --namespace my-app --set istio.injection=disabled
```