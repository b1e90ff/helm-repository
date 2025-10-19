# Web Service

Production-ready Helm chart for web services with optional external Istio Gateway integration and enterprise features.

## Features

- **Optional External Access**: HTTPRoute integration with Istio Gateway API (configurable)
- **Security**: ServiceAccount with ImagePullSecrets support for private registries
- **Configuration Management**: ConfigMaps and Secrets with automatic volume mounting
- **Health Monitoring**: Configurable liveness and readiness probes
- **Scaling**: Horizontal Pod Autoscaling support
- **Resource Management**: CPU and memory limits/requests
- **Deployment Flexibility**: Configurable node selection, affinity, and tolerations

## Use Cases

This chart can be used for:
- **Internal Services**: Web services that only need cluster-internal access
- **External Services**: Web services that need external access via Istio Gateway
- **Microservices**: Backend services with optional external endpoints
- **Frontend Applications**: Web frontends that need external access

## Configuration

### Core Settings

| Parameter | Description | Default |
|-----------|-------------|---------|
| `image.repository` | Docker image repository | `nginx` |
| `image.tag` | Docker image tag | `alpine` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `replicaCount` | Number of replicas | `2` |

### External Access (Optional)

| Parameter | Description | Default |
|-----------|-------------|---------|
| `externalRouting.enabled` | Enable external access via Istio Gateway | `false` |
| `externalRouting.hostname` | Domain for external access | `example.com` |
| `externalRouting.gateway.name` | Gateway name to attach to | `external-gateway` |
| `externalRouting.gateway.namespace` | Gateway namespace | `istio-system` |

### Security & RBAC

| Parameter | Description | Default |
|-----------|-------------|---------|
| `serviceAccount.create` | Create ServiceAccount | `true` |
| `serviceAccount.name` | ServiceAccount name (auto-generated if empty) | `""` |
| `serviceAccount.annotations` | ServiceAccount annotations | `{}` |
| `imagePullSecrets` | ImagePullSecrets for private registries | `[]` |

### Configuration Management

| Parameter | Description | Default |
|-----------|-------------|---------|
| `config.enabled` | Enable ConfigMap creation | `false` |
| `config.data` | ConfigMap data | `{}` |
| `secrets.enabled` | Enable Secret creation | `false` |
| `secrets.data` | Secret data (will be base64 encoded) | `{}` |

### Health Checks

| Parameter | Description | Default |
|-----------|-------------|---------|
| `healthCheck.enabled` | Enable health checks | `true` |
| `healthCheck.liveness.path` | Liveness probe HTTP path | `/` |
| `healthCheck.liveness.initialDelaySeconds` | Liveness initial delay | `30` |
| `healthCheck.liveness.periodSeconds` | Liveness check interval | `10` |
| `healthCheck.readiness.path` | Readiness probe HTTP path | `/` |
| `healthCheck.readiness.initialDelaySeconds` | Readiness initial delay | `5` |
| `healthCheck.readiness.periodSeconds` | Readiness check interval | `5` |

### Scaling & Resources

| Parameter | Description | Default |
|-----------|-------------|---------|
| `autoscaling.enabled` | Enable HPA | `false` |
| `autoscaling.minReplicas` | Minimum replicas | `2` |
| `autoscaling.maxReplicas` | Maximum replicas | `10` |
| `autoscaling.targetCPUUtilizationPercentage` | CPU threshold | `80` |
| `resources.limits.cpu` | CPU limit | `500m` |
| `resources.limits.memory` | Memory limit | `512Mi` |
| `resources.requests.cpu` | CPU request | `250m` |
| `resources.requests.memory` | Memory request | `256Mi` |

## Usage Examples

### Basic Internal Service (No External Access)

```yaml
# values.yaml
image:
  repository: my-internal-app
  tag: "1.0.0"

# No external routing - service is only accessible within cluster
externalRouting:
  enabled: false

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi
```

### Web Service with External Access

```yaml
# values.yaml
image:
  repository: my-web-app
  tag: "1.0.0"

# Enable external access
externalRouting:
  enabled: true
  hostname: myapp.example.com

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi
```

### Production Deployment with Secrets

```yaml
# values.yaml
image:
  repository: my-private-registry/my-app
  tag: "1.0.0"

# External access
externalRouting:
  enabled: true
  hostname: myapp.production.com

# Private registry access
imagePullSecrets:
  - name: my-registry-secret

# Application configuration
config:
  enabled: true
  data:
    app.properties: |
      server.port=8080
      logging.level=INFO
    config.json: |
      {"feature": "enabled"}

# Sensitive data
secrets:
  enabled: true
  data:
    database-password: "my-secret-password"
    api-key: "abc123xyz"

# Custom health checks
healthCheck:
  enabled: true
  liveness:
    path: /health
    initialDelaySeconds: 60
  readiness:
    path: /ready
    initialDelaySeconds: 10

# Scaling configuration
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilizationPercentage: 70
```

## Volume Mounts

When ConfigMaps or Secrets are enabled, they are automatically mounted:

- **ConfigMaps**: Mounted at `/app/config/`
- **Secrets**: Mounted at `/app/secrets/`
- **Environment Variables**: 
  - `CONFIG_MAP_NAME`: Name of the ConfigMap (if enabled)
  - `SECRET_NAME`: Name of the Secret (if enabled)

## External Access

When `externalRouting.enabled` is set to `true`, the chart creates an HTTPRoute that attaches to the specified gateway, making the service accessible at the configured hostname. 

For internal-only services, set `externalRouting.enabled: false` and the service will only be accessible within the cluster via the internal service.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- Istio with Gateway API support (only if using external routing)
- Gateway API CRDs installed (only if using external routing)