# External Web Service

Helm chart for deploying external web services with Istio Gateway access.

## Features

- External access via configurable domain
- HTTPRoute integration with Istio Gateway API
- Configurable Docker image via values
- Horizontal Pod Autoscaling support
- Health checks and resource limits

## Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `image.repository` | Docker image repository | `nginx` |
| `image.tag` | Docker image tag | `alpine` |
| `replicaCount` | Number of replicas | `2` |
| `routing.hostname` | Domain for external access | `example.com` |
| `routing.gateway.name` | Gateway name to attach to | `external-gateway` |
| `autoscaling.enabled` | Enable HPA | `false` |
| `resources.limits.cpu` | CPU limit | `500m` |
| `resources.limits.memory` | Memory limit | `512Mi` |

## External Access

The chart creates an HTTPRoute that attaches to the `external-gateway` in the `istio-system` namespace, making the service accessible at the configured hostname.