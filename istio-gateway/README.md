# Istio Gateway

Minimal Helm chart for Istio Gateway integration.

## Features

- No custom Gateway or Service resources are created
- Istio manages Gateway and Service objects automatically
- Clean integration with Gateway API

## Usage

This chart does not create any Gateway or Service resources. Istio will automatically create and manage all required objects according to the Gateway API specification.

## Configuration

No configuration required. All resources are managed by Istio.

## Notes

If you need custom Gateway or Service resources, use a separate chart or manifest. For most use cases, the Istio default behavior is sufficient.