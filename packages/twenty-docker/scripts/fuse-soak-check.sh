#!/usr/bin/env bash
set -euo pipefail

PUBLIC_HEALTH_URL="${PUBLIC_HEALTH_URL:-https://app.fusegtm.com/readyz}"
GOOGLE_AUTH_URL="${GOOGLE_AUTH_URL:-https://app.fusegtm.com/auth/google}"
EXPECTED_REDIRECT="${EXPECTED_REDIRECT:-https://app.fusegtm.com/auth/google/redirect}"

SSH_HOST="${SSH_HOST:-ubuntu@52.20.136.71}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/fuse-prod.pem}"
SSH_OPTS=(-o BatchMode=yes -o ConnectTimeout=10 -i "$SSH_KEY_PATH")

REMOTE_LOCAL_HEALTH_URL="${REMOTE_LOCAL_HEALTH_URL:-http://localhost:3000/readyz}"
REMOTE_WORKER_CONTAINER="${REMOTE_WORKER_CONTAINER:-twenty-worker-1}"
WORKER_LOG_LINES="${WORKER_LOG_LINES:-400}"

OUTPUT_FILE="${OUTPUT_FILE:-}"

if [ -z "$OUTPUT_FILE" ]; then
  mkdir -p docs/ops-logs
  OUTPUT_FILE="docs/ops-logs/fuse-soak-check-$(date -u +%Y%m%dT%H%M%SZ).md"
fi

pass_or_fail() {
  if [ "$1" = "0" ]; then
    echo "PASS"
  else
    echo "FAIL"
  fi
}

public_health_status="FAIL"
local_health_status="FAIL"
google_oauth_status="FAIL"
worker_activity_status="FAIL"

if curl -fsS "$PUBLIC_HEALTH_URL" >/dev/null 2>&1; then
  public_health_status="PASS"
fi

if ssh "${SSH_OPTS[@]}" "$SSH_HOST" "curl -fsS '$REMOTE_LOCAL_HEALTH_URL' >/dev/null" >/dev/null 2>&1; then
  local_health_status="PASS"
fi

google_location="$(curl -sSI "$GOOGLE_AUTH_URL" | awk -F': ' 'tolower($1)=="location"{print $2}' | tr -d '\r')"
if [[ "$google_location" == *"accounts.google.com"* ]] && [[ "$google_location" == *"redirect_uri="* ]]; then
  encoded_expected="$(python3 - <<'PY'
import urllib.parse
print(urllib.parse.quote("https://app.fusegtm.com/auth/google/redirect", safe=""))
PY
)"
  if [[ "$google_location" == *"$encoded_expected"* ]]; then
    google_oauth_status="PASS"
  fi
fi

if ssh "${SSH_OPTS[@]}" "$SSH_HOST" \
  "docker logs --tail $WORKER_LOG_LINES '$REMOTE_WORKER_CONTAINER' 2>/dev/null | grep -E 'processed on queue|WorkflowCronTriggerCronJob completed|Starting WorkflowRunEnqueueCronJob cron' >/dev/null"; then
  worker_activity_status="PASS"
fi

{
  echo "# Fuse Soak Check"
  echo
  echo "- timestamp_utc: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "- public_health_url: $PUBLIC_HEALTH_URL"
  echo "- local_health_url: $REMOTE_LOCAL_HEALTH_URL"
  echo "- google_auth_url: $GOOGLE_AUTH_URL"
  echo
  echo "| Check | Result |"
  echo "|---|---|"
  echo "| Public health | $public_health_status |"
  echo "| Local health | $local_health_status |"
  echo "| Google OAuth redirect | $google_oauth_status |"
  echo "| Worker activity | $worker_activity_status |"
} > "$OUTPUT_FILE"

echo "$OUTPUT_FILE"
