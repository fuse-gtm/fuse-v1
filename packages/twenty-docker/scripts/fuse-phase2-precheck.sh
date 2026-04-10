#!/usr/bin/env bash
# Phase 2 production mutation precheck.
# Verifies public health, local health, and requires explicit Sev-1 acknowledgment.
#
# Usage:
#   bash packages/twenty-docker/scripts/fuse-phase2-precheck.sh --ack-no-sev1
#   bash packages/twenty-docker/scripts/fuse-phase2-precheck.sh \
#     --ack-no-sev1 \
#     --ssh-target ubuntu@52.20.136.71 \
#     --ssh-key ~/.ssh/fuse-prod.pem
set -euo pipefail

PUBLIC_HEALTH_URL="${PUBLIC_HEALTH_URL:-https://app.fusegtm.com/readyz}"
LOCAL_HEALTH_URL="${LOCAL_HEALTH_URL:-http://localhost:3000/readyz}"
SSH_TARGET="${SSH_TARGET:-ubuntu@52.20.136.71}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/fuse-prod.pem}"
CURL_MAX_TIME_SECONDS="${CURL_MAX_TIME_SECONDS:-10}"
ACK_NO_SEV1="${ACK_NO_SEV1:-false}"

usage() {
  cat <<'EOF'
Usage: fuse-phase2-precheck.sh [options]

Options:
  --ack-no-sev1              Confirm there are no unresolved Sev-1 incidents.
  --public-url <url>         Public readiness URL (default: https://app.fusegtm.com/readyz)
  --local-url <url>          Local readiness URL on app host (default: http://localhost:3000/readyz)
  --ssh-target <user@host>   SSH target for remote local-health check fallback.
  --ssh-key <path>           SSH private key path for remote local-health check fallback.
  --help                     Show this help text.

Environment variable equivalents:
  PUBLIC_HEALTH_URL
  LOCAL_HEALTH_URL
  SSH_TARGET
  SSH_KEY
  CURL_MAX_TIME_SECONDS
  ACK_NO_SEV1
EOF
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
  curl -fsS --max-time "$CURL_MAX_TIME_SECONDS" "$url" >/dev/null
}

check_local_via_ssh() {
  local escaped_local_url
  escaped_local_url="${LOCAL_HEALTH_URL//\"/\\\"}"

  ssh \
    -i "$SSH_KEY" \
    -o BatchMode=yes \
    -o ConnectTimeout=10 \
    -o StrictHostKeyChecking=accept-new \
    "$SSH_TARGET" \
    "curl -fsS --max-time ${CURL_MAX_TIME_SECONDS} \"${escaped_local_url}\" >/dev/null"
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --ack-no-sev1)
      ACK_NO_SEV1="true"
      shift
      ;;
    --public-url)
      PUBLIC_HEALTH_URL="${2:-}"
      shift 2
      ;;
    --local-url)
      LOCAL_HEALTH_URL="${2:-}"
      shift 2
      ;;
    --ssh-target)
      SSH_TARGET="${2:-}"
      shift 2
      ;;
    --ssh-key)
      SSH_KEY="${2:-}"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [ -z "$PUBLIC_HEALTH_URL" ] || [ -z "$LOCAL_HEALTH_URL" ]; then
  echo "Both --public-url and --local-url (or env vars) must be set." >&2
  exit 1
fi

if [ "$ACK_NO_SEV1" != "true" ]; then
  log_line "error" "check=sev1 status=missing_ack message='verify alerts and re-run with --ack-no-sev1'"
  exit 1
fi

log_line "info" "check=public status=running url=${PUBLIC_HEALTH_URL}"
check_url "$PUBLIC_HEALTH_URL"
log_line "info" "check=public status=ok url=${PUBLIC_HEALTH_URL}"

log_line "info" "check=local status=running url=${LOCAL_HEALTH_URL}"
if check_url "$LOCAL_HEALTH_URL"; then
  log_line "info" "check=local status=ok mode=direct url=${LOCAL_HEALTH_URL}"
else
  log_line "warn" "check=local status=direct_failed action=ssh_fallback target=${SSH_TARGET}"
  check_local_via_ssh
  log_line "info" "check=local status=ok mode=ssh target=${SSH_TARGET} url=${LOCAL_HEALTH_URL}"
fi

log_line "info" "check=sev1 status=acknowledged"
log_line "info" "result=pass gate=phase2-mutation-window"
