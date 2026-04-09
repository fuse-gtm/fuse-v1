#!/usr/bin/env bash
# Create external Route53 health checks + CloudWatch alarms for Fuse ingress.
# This catches host-level failures even when the app host cannot publish metrics.
#
# Usage:
#   APP_HOST=app.fusegtm.com \
#   ALERT_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:fuse-prod-alerts \
#   bash packages/twenty-docker/scripts/fuse-setup-external-health-check.sh
set -euo pipefail

APP_HOST="${APP_HOST:?APP_HOST required}"
REGION="${AWS_DEFAULT_REGION:-us-east-1}"
ALERT_TOPIC_ARN="${ALERT_TOPIC_ARN:-}"
HEALTHZ_PATH="${HEALTHZ_PATH:-/healthz}"
ROOT_PATH="${ROOT_PATH:-/}"
REQUEST_INTERVAL="${REQUEST_INTERVAL:-30}"
FAILURE_THRESHOLD="${FAILURE_THRESHOLD:-3}"

log() { echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") $*" >&2; }

ensure_route53_access() {
  if aws route53 list-health-checks --max-items 1 >/dev/null 2>&1; then
    return 0
  fi

  echo "Missing Route53 permissions for health check management." >&2
  echo "Required actions: route53:ListHealthChecks, route53:CreateHealthCheck, route53:ChangeTagsForResource." >&2
  exit 1
}

find_health_check_id() {
  local path="$1"
  aws route53 list-health-checks \
    --query "HealthChecks[?HealthCheckConfig.FullyQualifiedDomainName=='${APP_HOST}' && HealthCheckConfig.Type=='HTTPS' && HealthCheckConfig.ResourcePath=='${path}'].Id | [0]" \
    --output text 2>/dev/null
}

create_health_check() {
  local name="$1"
  local path="$2"
  local caller_ref
  caller_ref="fuse-${name}-$(date +%s)"

  local health_check_id
  health_check_id="$(aws route53 create-health-check \
    --caller-reference "$caller_ref" \
    --health-check-config "Type=HTTPS,FullyQualifiedDomainName=${APP_HOST},Port=443,ResourcePath=${path},RequestInterval=${REQUEST_INTERVAL},FailureThreshold=${FAILURE_THRESHOLD},MeasureLatency=true,EnableSNI=true" \
    --query 'HealthCheck.Id' \
    --output text)"

  aws route53 change-tags-for-resource \
    --resource-type healthcheck \
    --resource-id "$health_check_id" \
    --add-tags "Key=Name,Value=${name}" "Key=ManagedBy,Value=fuse-setup-external-health-check.sh" >/dev/null

  echo "$health_check_id"
}

ensure_health_check() {
  local name="$1"
  local path="$2"

  local health_check_id
  health_check_id="$(find_health_check_id "$path")"

  if [ -z "$health_check_id" ] || [ "$health_check_id" = "None" ]; then
    log "Creating Route53 health check ${name} path=${path}"
    health_check_id="$(create_health_check "$name" "$path")"
  else
    log "Reusing Route53 health check ${name} path=${path} id=${health_check_id}"
  fi

  if [ -z "$health_check_id" ] || [ "$health_check_id" = "None" ]; then
    echo "Failed to resolve Route53 health check id for ${name} (${path})" >&2
    exit 1
  fi

  echo "$health_check_id"
}

put_alarm() {
  local alarm_name="$1"
  local alarm_description="$2"
  local health_check_id="$3"

  local args=(
    --alarm-name "$alarm_name"
    --alarm-description "$alarm_description"
    --namespace "AWS/Route53"
    --metric-name "HealthCheckStatus"
    --dimensions "Name=HealthCheckId,Value=${health_check_id}"
    --statistic "Minimum"
    --period 60
    --evaluation-periods 3
    --threshold 1
    --comparison-operator "LessThanThreshold"
    --treat-missing-data "breaching"
    --region "$REGION"
  )

  if [ -n "$ALERT_TOPIC_ARN" ]; then
    args+=(--alarm-actions "$ALERT_TOPIC_ARN" --ok-actions "$ALERT_TOPIC_ARN")
  fi

  aws cloudwatch put-metric-alarm "${args[@]}"
}

ensure_route53_access

HEALTHZ_CHECK_ID="$(ensure_health_check "fuse-external-healthz" "$HEALTHZ_PATH")"
ROOT_CHECK_ID="$(ensure_health_check "fuse-external-root" "$ROOT_PATH")"

log "Creating/updating CloudWatch alarms (region=${REGION})"
put_alarm \
  "fuse-external-healthz-check" \
  "External Route53 health check failed for https://${APP_HOST}${HEALTHZ_PATH}" \
  "$HEALTHZ_CHECK_ID"

put_alarm \
  "fuse-external-root-check" \
  "External Route53 health check failed for https://${APP_HOST}${ROOT_PATH}" \
  "$ROOT_CHECK_ID"

log "Done."
echo "healthz_check_id=${HEALTHZ_CHECK_ID}"
echo "root_check_id=${ROOT_CHECK_ID}"
