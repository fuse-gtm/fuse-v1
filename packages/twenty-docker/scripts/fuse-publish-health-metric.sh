#!/usr/bin/env bash
# Publish Fuse health metric to CloudWatch.
# Designed to run every minute via cron.
#
# Publishes a custom metric "FuseHealthCheck" with value 1 (healthy) or 0 (unhealthy).
# CloudWatch alarm triggers on 0 and sends to SNS topic.
#
# Usage:
#   bash packages/twenty-docker/scripts/fuse-publish-health-metric.sh
#
# Cron (every 1 min):
#   * * * * * /opt/fuse/packages/twenty-docker/scripts/fuse-publish-health-metric.sh >> /var/log/fuse-health-metric.log 2>&1
#
# Environment:
#   LOCAL_HEALTHCHECK_URL   URL to check (default: http://localhost:3000/healthz)
#   CW_NAMESPACE            CloudWatch namespace (default: Fuse/Production)
#   CW_METRIC_NAME          Metric name (default: FuseHealthCheck)
#   AWS_DEFAULT_REGION      Region (default: us-east-1)
set -euo pipefail

LOCAL_HEALTHCHECK_URL="${LOCAL_HEALTHCHECK_URL:-http://localhost:3000/healthz}"
CW_NAMESPACE="${CW_NAMESPACE:-Fuse/Production}"
CW_METRIC_NAME="${CW_METRIC_NAME:-FuseHealthCheck}"
REGION="${AWS_DEFAULT_REGION:-us-east-1}"
CURL_TIMEOUT="${CURL_TIMEOUT:-5}"

now() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

if curl -fsS --max-time "$CURL_TIMEOUT" "$LOCAL_HEALTHCHECK_URL" >/dev/null 2>&1; then
  VALUE=1
else
  VALUE=0
fi

aws cloudwatch put-metric-data \
  --namespace "$CW_NAMESPACE" \
  --metric-name "$CW_METRIC_NAME" \
  --value "$VALUE" \
  --unit "None" \
  --region "$REGION" 2>/dev/null \
  && echo "$(now) metric=${CW_METRIC_NAME} value=${VALUE}" \
  || echo "$(now) metric=${CW_METRIC_NAME} value=${VALUE} publish=failed"
