# Istio Gateway

A Helm chart for deploying Kubernetes Gateway API resources with Istio.

## What it does

Creates Kubernetes Gateway API resources to expose applications in your cluster using Istio's Gateway API implementation.

## Installation

```bash
helm install istio-gateway ./istio-gateway --namespace istio-system
```

## Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `externalGateway.enabled` | Enable the external gateway | `true` |
| `externalGateway.name` | Gateway name | `external-gateway` |
| `externalGateway.http.port` | HTTP port | `80` |
| `externalGateway.http.hostname` | Hostname pattern for routing | `*.tat.systems` |
| `externalGateway.http.allowedRoutes.namespaces` | Namespaces allowed to attach routes | `[portfolio]` |
| `externalGateway.service.nodePort` | NodePort for external access | `30080` |

## Usage

```bash
# Basic gateway
helm install my-gateway ./istio-gateway --namespace istio-system

# Custom domain and namespaces
helm install my-gateway ./istio-gateway \
  --namespace istio-system \
  --set externalGateway.http.hostname="*.mydomain.com" \
  --set externalGateway.http.allowedRoutes.namespaces="{app1,app2}"
```

## HTTPRoute Example

Applications can create HTTPRoutes to attach to this gateway:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: my-app-route
  namespace: portfolio
spec:
  parentRefs:
  - name: external-gateway
    namespace: istio-system
  hostnames:
  - "app.tat.systems"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: my-app-service
      port: 80
```