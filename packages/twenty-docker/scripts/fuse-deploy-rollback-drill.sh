#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-packages/twenty-docker/.env}"
EXTRA_COMPOSE_FILE="${EXTRA_COMPOSE_FILE:-packages/twenty-docker/docker-compose.aws.yml}"
VERIFY_PUBLIC_URL="${VERIFY_PUBLIC_URL:-true}"
LOCAL_HEALTH_URL="${LOCAL_HEALTH_URL:-http://localhost:3000/readyz}"
PUBLIC_HEALTH_URL="${PUBLIC_HEALTH_URL:-https://app.fusegtm.com/readyz}"
CURL_MAX_TIME_SECONDS="${CURL_MAX_TIME_SECONDS:-10}"
LOG_FILE="${LOG_FILE:-}"

TAG_A=""
TAG_B=""

usage() {
  cat <<'EOF'
Usage:
  bash packages/twenty-docker/scripts/fuse-deploy-rollback-drill.sh \
    --tag-a partner-os-aaaa1111 \
    --tag-b partner-os-bbbb2222

Optional env:
  ENV_FILE=packages/twenty-docker/.env
  EXTRA_COMPOSE_FILE=packages/twenty-docker/docker-compose.aws.yml
  VERIFY_PUBLIC_URL=true
  LOCAL_HEALTH_URL=http://localhost:3000/readyz
  PUBLIC_HEALTH_URL=https://app.fusegtm.com/readyz
  LOG_FILE=docs/ops-logs/fuse-deploy-rollback-<timestamp>.md

This script:
  1) Deploys tag A
  2) Deploys tag B
  3) Rolls back to tag A
  4) Writes command/timing evidence to a markdown log
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --tag-a)
      TAG_A="${2:-}"
      shift 2
      ;;
    --tag-b)
      TAG_B="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [ -z "$TAG_A" ] || [ -z "$TAG_B" ]; then
  echo "--tag-a and --tag-b are required." >&2
  usage >&2
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file: $ENV_FILE" >&2
  exit 1
fi

if [ -z "$LOG_FILE" ]; then
  mkdir -p docs/ops-logs
  LOG_FILE="docs/ops-logs/fuse-deploy-rollback-$(date -u +%Y%m%dT%H%M%SZ).md"
fi

log() {
  echo "$1" | tee -a "$LOG_FILE"
}

timestamp_utc() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

health_check() {
  local label="$1"
  local local_status="PASS"
  local public_status="SKIPPED"

  if ! curl -fsS --max-time "$CURL_MAX_TIME_SECONDS" "$LOCAL_HEALTH_URL" >/dev/null 2>&1; then
    local_status="FAIL"
  fi

  if [ "$VERIFY_PUBLIC_URL" = "true" ]; then
    public_status="PASS"
    if ! curl -fsS --max-time "$CURL_MAX_TIME_SECONDS" "$PUBLIC_HEALTH_URL" >/dev/null 2>&1; then
      public_status="FAIL"
    fi
  fi

  log "- ${label} local health (${LOCAL_HEALTH_URL}): ${local_status}"
  log "- ${label} public health (${PUBLIC_HEALTH_URL}): ${public_status}"

  if [ "$local_status" = "FAIL" ] || [ "$public_status" = "FAIL" ]; then
    echo "Health check failed after ${label}" >&2
    exit 1
  fi
}

run_deploy() {
  local label="$1"
  local tag="$2"
  local start_epoch
  local end_epoch
  local duration
  local start_ts
  local end_ts

  start_epoch="$(date -u +%s)"
  start_ts="$(timestamp_utc)"

  log ""
  log "## ${label}: ${tag}"
  log "- start: ${start_ts}"
  log "- command:"
  log '```bash'
  log "ENV_FILE=${ENV_FILE} EXTRA_COMPOSE_FILE=${EXTRA_COMPOSE_FILE} VERIFY_PUBLIC_URL=${VERIFY_PUBLIC_URL} bash packages/twenty-docker/scripts/deploy-fuse-prod.sh ${tag}"
  log '```'

  ENV_FILE="$ENV_FILE" \
  EXTRA_COMPOSE_FILE="$EXTRA_COMPOSE_FILE" \
  VERIFY_PUBLIC_URL="$VERIFY_PUBLIC_URL" \
  bash packages/twenty-docker/scripts/deploy-fuse-prod.sh "$tag"

  end_epoch="$(date -u +%s)"
  end_ts="$(timestamp_utc)"
  duration="$((end_epoch - start_epoch))"

  log "- end: ${end_ts}"
  log "- duration_seconds: ${duration}"
  health_check "$label"
}

{
  echo "# Fuse Deploy/Rollback Drill"
  echo
  echo "- generated_at_utc: $(timestamp_utc)"
  echo "- env_file: $ENV_FILE"
  echo "- extra_compose_file: $EXTRA_COMPOSE_FILE"
  echo "- verify_public_url: $VERIFY_PUBLIC_URL"
  echo "- curl_max_time_seconds: $CURL_MAX_TIME_SECONDS"
  echo "- baseline_tag_a: $TAG_A"
  echo "- candidate_tag_b: $TAG_B"
} > "$LOG_FILE"

run_deploy "Deploy baseline A" "$TAG_A"
run_deploy "Deploy candidate B" "$TAG_B"

rollback_start_epoch="$(date -u +%s)"
run_deploy "Rollback to A" "$TAG_A"
rollback_end_epoch="$(date -u +%s)"
rollback_recovery_seconds="$((rollback_end_epoch - rollback_start_epoch))"

log ""
log "## Summary"
log "- rollback_recovery_seconds: ${rollback_recovery_seconds}"
log "- status: PASS"

echo "Drill complete. Evidence written to ${LOG_FILE}"
