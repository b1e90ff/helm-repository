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
| `externalGateway.enabled` | Enable the external gateway | `false` |
| `externalGateway.name` | Gateway name | `external-gateway` |
| `externalGateway.http.port` | HTTP port | *(required if enabled)* |
| `externalGateway.http.hostname` | Hostname pattern for routing | *(required if enabled)* |
| `externalGateway.http.allowedRoutes.namespaces` | Namespaces allowed to attach routes | *(required if enabled)* |
| `externalGateway.service.nodePort` | NodePort for external access | `30080` |
| `externalGateway.service.ports` | Service ports for external access | *(required if enabled)* |

## HTTPRoute Integration

Applications create HTTPRoutes to attach to this gateway:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-route
  namespace: default
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

## Chart Behavior

By default, `externalGateway.enabled` is set to `false`. This means the chart will not render any resources unless you explicitly enable the gateway in your values file or ConfigMap:

```yaml
externalGateway:
  enabled: true
  # ... weitere Konfiguration ...
```

### Why does `helm template` produce no output with default values?
If you run `helm template` without a custom values file, the chart will not generate any resources. This is intentional for security and flexibility. To deploy the gateway, set `externalGateway.enabled: true` in your values file.

### How to avoid CI errors
If you want to avoid CI errors when testing the chart with default values, you can:
- Add a test values file for CI that sets `enabled: true`.
- Adjust your CI workflow to test with a custom values file.
- Document this behavior in your README (see above).

## Example: Enable Gateway

```yaml
externalGateway:
  enabled: true
  name: external-gateway
  # ... weitere Einstellungen ...
```