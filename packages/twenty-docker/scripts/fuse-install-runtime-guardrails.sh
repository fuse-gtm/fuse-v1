#!/usr/bin/env bash
# Install (idempotent) runtime watchdog + health metric cron jobs on host.
#
# Usage:
#   ENV_FILE=/opt/fuse/packages/twenty-docker/.env \
#   EXTRA_COMPOSE_FILE=/opt/fuse/packages/twenty-docker/docker-compose.aws.yml \
#   bash packages/twenty-docker/scripts/fuse-install-runtime-guardrails.sh
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
DEFAULT_REPO_ROOT="$(cd "${SELF_DIR}/../../.." && pwd)"

REPO_ROOT="${REPO_ROOT:-$DEFAULT_REPO_ROOT}"
ENV_FILE="${ENV_FILE:-${REPO_ROOT}/packages/twenty-docker/.env}"
WATCHDOG_SCRIPT="${WATCHDOG_SCRIPT:-${REPO_ROOT}/packages/twenty-docker/scripts/check-runtime-and-ingress.sh}"
METRIC_SCRIPT="${METRIC_SCRIPT:-${REPO_ROOT}/packages/twenty-docker/scripts/fuse-publish-health-metric.sh}"
WATCHDOG_LOG="${WATCHDOG_LOG:-/var/log/fuse-watchdog.log}"
METRIC_LOG="${METRIC_LOG:-/var/log/fuse-health-metric.log}"
WATCHDOG_SCHEDULE="${WATCHDOG_SCHEDULE:-*/5 * * * *}"
METRIC_SCHEDULE="${METRIC_SCHEDULE:-* * * * *}"
VERIFY_PUBLIC_INGRESS="${VERIFY_PUBLIC_INGRESS:-true}"
EXTRA_COMPOSE_FILE="${EXTRA_COMPOSE_FILE:-}"
RUN_SMOKE_CHECKS="${RUN_SMOKE_CHECKS:-true}"

for path in "$WATCHDOG_SCRIPT" "$METRIC_SCRIPT"; do
  if [ ! -x "$path" ]; then
    if [ -f "$path" ]; then
      chmod +x "$path"
    else
      echo "Missing script: $path" >&2
      exit 1
    fi
  fi
done

mkdir -p "$(dirname "$WATCHDOG_LOG")" "$(dirname "$METRIC_LOG")"
touch "$WATCHDOG_LOG" "$METRIC_LOG"

WATCHDOG_CMD="ENV_FILE=${ENV_FILE} VERIFY_PUBLIC_INGRESS=${VERIFY_PUBLIC_INGRESS}"
if [ -n "$EXTRA_COMPOSE_FILE" ]; then
  WATCHDOG_CMD="${WATCHDOG_CMD} EXTRA_COMPOSE_FILE=${EXTRA_COMPOSE_FILE}"
fi
WATCHDOG_CMD="${WATCHDOG_CMD} ${WATCHDOG_SCRIPT} >> ${WATCHDOG_LOG} 2>&1"
METRIC_CMD="${METRIC_SCRIPT} >> ${METRIC_LOG} 2>&1"

TMP_CRON="$(mktemp)"
trap 'rm -f "$TMP_CRON"' EXIT

crontab -l 2>/dev/null \
  | grep -vF "$WATCHDOG_SCRIPT" \
  | grep -vF "$METRIC_SCRIPT" > "$TMP_CRON" || true

{
  cat "$TMP_CRON"
  echo "${WATCHDOG_SCHEDULE} ${WATCHDOG_CMD}"
  echo "${METRIC_SCHEDULE} ${METRIC_CMD}"
} > "${TMP_CRON}.next"
mv "${TMP_CRON}.next" "$TMP_CRON"

crontab "$TMP_CRON"

echo "Installed runtime guardrails cron entries:"
crontab -l | grep -E "$(basename "$WATCHDOG_SCRIPT")|$(basename "$METRIC_SCRIPT")"

if [ "$RUN_SMOKE_CHECKS" = "true" ]; then
  echo "Running smoke checks now..."
  eval "$WATCHDOG_CMD"
  eval "$METRIC_CMD"
fi

echo "Done."
