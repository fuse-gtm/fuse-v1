#!/usr/bin/env bash
# Fuse runtime watchdog: checks local server + public ingress health.
# Restarts server container on local failure, Caddy on public failure.
#
# Usage:
#   ENV_FILE=packages/twenty-docker/.env \
#   VERIFY_PUBLIC_INGRESS=true \
#   bash packages/twenty-docker/scripts/check-runtime-and-ingress.sh
#
# Cron (every 5 min):
#   */5 * * * * ENV_FILE=/opt/fuse/packages/twenty-docker/.env VERIFY_PUBLIC_INGRESS=true /opt/fuse/packages/twenty-docker/scripts/check-runtime-and-ingress.sh >> /var/log/fuse-watchdog.log 2>&1
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SELF_DIR}/../../.." && pwd)"
cd "$REPO_ROOT"

as_bool() {
  case "${1:-false}" in
    true|TRUE|1|yes|YES) echo "true" ;;
    *) echo "false" ;;
  esac
}

now() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

log_line() {
  local level="$1"
  local message="$2"
  echo "$(now) level=${level} ${message}"
}

check_url() {
  local url="$1"
  local max_time="$2"
  curl -fsS --max-time "$max_time" "$url" >/dev/null 2>&1
}

wait_for_local_health() {
  local timeout="$1"
  local interval="$2"
  local start_ts
  start_ts="$(date +%s)"

  while true; do
    if check_url "$LOCAL_HEALTHCHECK_URL" "$CURL_MAX_TIME_SECONDS"; then
      return 0
    fi

    local now_ts
    now_ts="$(date +%s)"
    if [ $((now_ts - start_ts)) -ge "$timeout" ]; then
      return 1
    fi

    sleep "$interval"
  done
}

restart_server() {
  log_line "warn" "check=local status=failed action=restart_server"
  docker compose "${COMPOSE_ARGS[@]}" restart server >/dev/null
}

restart_caddy() {
  if command -v systemctl >/dev/null 2>&1; then
    if systemctl restart "${CADDY_SERVICE_NAME}.service" >/dev/null 2>&1; then
      log_line "warn" "check=public status=failed action=restart_caddy service=${CADDY_SERVICE_NAME}.service"
      return 0
    fi
  fi

  log_line "error" "check=public status=failed action=restart_caddy unavailable=true"
  return 1
}

# --- Configuration ---
ENV_FILE="${ENV_FILE:-packages/twenty-docker/.env}"
LOCAL_HEALTHCHECK_URL="${LOCAL_HEALTHCHECK_URL:-http://localhost:3000/readyz}"
PUBLIC_BASE_URL="${PUBLIC_BASE_URL:-}"
PUBLIC_HEALTHCHECK_URL="${PUBLIC_HEALTHCHECK_URL:-}"
VERIFY_PUBLIC_INGRESS="${VERIFY_PUBLIC_INGRESS:-auto}"
CADDY_SERVICE_NAME="${CADDY_SERVICE_NAME:-caddy}"
CURL_MAX_TIME_SECONDS="${CURL_MAX_TIME_SECONDS:-10}"
RECOVERY_TIMEOUT_SECONDS="${RECOVERY_TIMEOUT_SECONDS:-180}"
RECHECK_INTERVAL_SECONDS="${RECHECK_INTERVAL_SECONDS:-5}"
CADDY_RESTART_GRACE_SECONDS="${CADDY_RESTART_GRACE_SECONDS:-8}"
EXTRA_COMPOSE_FILE="${EXTRA_COMPOSE_FILE:-}"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if [ -z "$PUBLIC_HEALTHCHECK_URL" ] && [ -n "$PUBLIC_BASE_URL" ]; then
  PUBLIC_HEALTHCHECK_URL="${PUBLIC_BASE_URL%/}/readyz"
fi

if [ "$VERIFY_PUBLIC_INGRESS" = "auto" ]; then
  if [ -n "$PUBLIC_HEALTHCHECK_URL" ]; then
    VERIFY_PUBLIC_INGRESS="true"
  else
    VERIFY_PUBLIC_INGRESS="false"
  fi
fi
VERIFY_PUBLIC_INGRESS="$(as_bool "$VERIFY_PUBLIC_INGRESS")"

# --- Compose args (match prod shape) ---
COMPOSE_ARGS=(
  -f packages/twenty-docker/docker-compose.yml
  -f packages/twenty-docker/docker-compose.fuse.yml
  --env-file "$ENV_FILE"
)
if [ -n "$EXTRA_COMPOSE_FILE" ]; then
  COMPOSE_ARGS+=(-f "$EXTRA_COMPOSE_FILE")
fi

# --- Check local health ---
if ! check_url "$LOCAL_HEALTHCHECK_URL" "$CURL_MAX_TIME_SECONDS"; then
  restart_server
  if ! wait_for_local_health "$RECOVERY_TIMEOUT_SECONDS" "$RECHECK_INTERVAL_SECONDS"; then
    log_line "error" "check=local status=failed_recovery url=${LOCAL_HEALTHCHECK_URL}"
    exit 1
  fi
  log_line "info" "check=local status=recovered url=${LOCAL_HEALTHCHECK_URL}"
else
  log_line "info" "check=local status=ok url=${LOCAL_HEALTHCHECK_URL}"
fi

# --- Check public health (via Caddy) ---
if [ "$VERIFY_PUBLIC_INGRESS" != "true" ]; then
  log_line "info" "check=public status=skipped reason=verification_disabled"
  exit 0
fi

if [ -z "$PUBLIC_HEALTHCHECK_URL" ]; then
  log_line "error" "check=public status=failed reason=missing_healthcheck_url"
  exit 1
fi

if ! check_url "$PUBLIC_HEALTHCHECK_URL" "$CURL_MAX_TIME_SECONDS"; then
  restart_caddy || exit 1
  sleep "$CADDY_RESTART_GRACE_SECONDS"
  if ! check_url "$PUBLIC_HEALTHCHECK_URL" "$CURL_MAX_TIME_SECONDS"; then
    log_line "error" "check=public status=failed_recovery url=${PUBLIC_HEALTHCHECK_URL}"
    exit 1
  fi
  log_line "info" "check=public status=recovered url=${PUBLIC_HEALTHCHECK_URL}"
else
  log_line "info" "check=public status=ok url=${PUBLIC_HEALTHCHECK_URL}"
fi
