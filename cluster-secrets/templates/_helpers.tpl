{{/*
Collect unique namespaces from all sealed secrets.
Excludes the release namespace since it already exists.
*/}}
{{- define "cluster-secrets.namespaces" -}}
{{- $namespaces := list -}}
{{- range .Values.sealedSecrets -}}
  {{- if .namespaces -}}
    {{- range .namespaces -}}
      {{- $namespaces = append $namespaces . -}}
    {{- end -}}
  {{- else if .namespace -}}
    {{- $namespaces = append $namespaces .namespace -}}
  {{- end -}}
{{- end -}}
{{- $namespaces | uniq | sortAlpha | toJson -}}
{{- end -}}
