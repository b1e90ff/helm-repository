# Istio Gateway

Helm chart for Kubernetes Gateway API resources with Istio.

## Features

- Kubernetes Gateway API implementation  
- External traffic routing via Istio
- Configurable hostnames and ports
- NodePort service for cluster access
- Namespace-based route filtering

## Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `externalGateway.enabled` | Enable the external gateway | `true` |
| `externalGateway.name` | Gateway name | `external-gateway` |
| `externalGateway.http.port` | HTTP port | `80` |
| `externalGateway.http.hostname` | Hostname pattern for routing | `*.tat.systems` |
| `externalGateway.http.allowedRoutes.namespaces` | Namespaces allowed to attach routes | `[portfolio]` |
| `externalGateway.service.nodePort` | NodePort for external access | `30080` |

## HTTPRoute Integration

Applications create HTTPRoutes to attach to this gateway:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-route
  namespace: portfolio
spec:
  parentRefs:
  - name: external-gateway
    namespace: istio-system
  hostnames:
  - "app.example.com"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: app-service
      port: 80
```