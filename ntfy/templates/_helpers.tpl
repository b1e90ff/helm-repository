{{- define "ntfy.fullname" -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "ntfy.labels" -}}
app.kubernetes.io/name: ntfy
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
{{- end -}}

{{- define "ntfy.selectorLabels" -}}
app.kubernetes.io/name: ntfy
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
