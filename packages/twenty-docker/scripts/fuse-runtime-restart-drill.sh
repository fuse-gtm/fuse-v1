#!/usr/bin/env bash
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SELF_DIR}/../../.." && pwd)"
cd "$REPO_ROOT"

ENV_FILE="${ENV_FILE:-packages/twenty-docker/.env}"
EXTRA_COMPOSE_FILE="${EXTRA_COMPOSE_FILE:-packages/twenty-docker/docker-compose.aws.yml}"
LOCAL_HEALTH_URL="${LOCAL_HEALTH_URL:-http://localhost:3000/readyz}"
PUBLIC_HEALTH_URL="${PUBLIC_HEALTH_URL:-https://app.fusegtm.com/readyz}"
VERIFY_PUBLIC="${VERIFY_PUBLIC:-true}"
MAX_WAIT_SECONDS="${MAX_WAIT_SECONDS:-180}"
CURL_MAX_TIME_SECONDS="${CURL_MAX_TIME_SECONDS:-5}"
CHECK_HOST_FREE_MEM="${CHECK_HOST_FREE_MEM:-true}"
MIN_FREE_MEM_MB="${MIN_FREE_MEM_MB:-512}"
COOLDOWN_SECONDS="${COOLDOWN_SECONDS:-15}"
CYCLES="${CYCLES:-1}"
OUTPUT_FILE="${OUTPUT_FILE:-docs/ops-logs/fuse-runtime-restart-drill-$(date -u +%Y%m%dT%H%M%SZ).md}"

as_bool() {
  case "${1:-false}" in
    true|TRUE|1|yes|YES) echo "true" ;;
    *) echo "false" ;;
  esac
}

now_utc() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

detect_available_mem_mb() {
  if [ -r /proc/meminfo ]; then
    local kb
    kb="$(awk '/MemAvailable:/ {print $2}' /proc/meminfo)"
    if [ -n "$kb" ]; then
      echo $((kb / 1024))
      return
    fi
  fi

  if command -v vm_stat >/dev/null 2>&1; then
    local pages_free
    local page_size
    pages_free="$(vm_stat | awk '/Pages free:/ {gsub("\\.", "", $3); print $3}')"
    page_size="$(vm_stat | awk '/page size of/ {print $8}')"
    if [ -n "$pages_free" ] && [ -n "$page_size" ]; then
      echo $((pages_free * page_size / 1024 / 1024))
      return
    fi
  fi

  echo 0
}

assert_min_free_memory() {
  local available_mem_mb
  available_mem_mb="$(detect_available_mem_mb)"

  if [ "$available_mem_mb" -gt 0 ] && [ "$available_mem_mb" -lt "$MIN_FREE_MEM_MB" ]; then
    echo "Low free memory (${available_mem_mb}MB < ${MIN_FREE_MEM_MB}MB)." >&2
    return 1
  fi

  return 0
}

wait_for_url() {
  local url="$1"
  local start_ts
  start_ts="$(date +%s)"

  until curl -fsS --max-time "$CURL_MAX_TIME_SECONDS" "$url" >/dev/null 2>&1; do
    local now_ts
    now_ts="$(date +%s)"
    if [ $((now_ts - start_ts)) -ge "$MAX_WAIT_SECONDS" ]; then
      echo "-1"
      return 1
    fi
    sleep 2
  done

  local end_ts
  end_ts="$(date +%s)"
  echo $((end_ts - start_ts))
}

VERIFY_PUBLIC="$(as_bool "$VERIFY_PUBLIC")"
CHECK_HOST_FREE_MEM="$(as_bool "$CHECK_HOST_FREE_MEM")"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file: $ENV_FILE" >&2
  exit 1
fi

COMPOSE_ARGS=(
  -f packages/twenty-docker/docker-compose.yml
  -f packages/twenty-docker/docker-compose.fuse.yml
)

if [ -n "$EXTRA_COMPOSE_FILE" ]; then
  COMPOSE_ARGS+=(-f "$EXTRA_COMPOSE_FILE")
fi

COMPOSE_ARGS+=(--env-file "$ENV_FILE")

mkdir -p "$(dirname "$OUTPUT_FILE")"
{
  echo "# Fuse Runtime Restart Drill"
  echo
  echo "- timestamp_utc: $(now_utc)"
  echo "- env_file: $ENV_FILE"
  echo "- verify_public: $VERIFY_PUBLIC"
  echo "- max_wait_seconds: $MAX_WAIT_SECONDS"
  echo "- curl_max_time_seconds: $CURL_MAX_TIME_SECONDS"
  echo "- check_host_free_mem: $CHECK_HOST_FREE_MEM"
  echo "- min_free_mem_mb: $MIN_FREE_MEM_MB"
  echo "- cooldown_seconds: $COOLDOWN_SECONDS"
  echo "- cycles: $CYCLES"
  echo
  echo "| Cycle | Start (UTC) | Local Recovery (s) | Public Recovery (s) | server process | Result |"
  echo "|---|---|---:|---:|---|---|"
} > "$OUTPUT_FILE"

for cycle in $(seq 1 "$CYCLES"); do
  start_at="$(now_utc)"
  result="PASS"

  if [ "$CHECK_HOST_FREE_MEM" = "true" ] && ! assert_min_free_memory; then
    echo "| $cycle | $start_at | n/a | n/a | n/a | FAIL(low-mem) |" >> "$OUTPUT_FILE"
    exit 1
  fi

  docker compose "${COMPOSE_ARGS[@]}" restart server >/dev/null

  local_recovery="-1"
  if ! local_recovery="$(wait_for_url "$LOCAL_HEALTH_URL")"; then
    result="FAIL(local)"
  fi

  public_recovery="n/a"
  if [ "$VERIFY_PUBLIC" = "true" ]; then
    public_recovery="-1"
    if ! public_recovery="$(wait_for_url "$PUBLIC_HEALTH_URL")"; then
      result="FAIL(public)"
    fi
  fi

  server_container_id="$(docker compose "${COMPOSE_ARGS[@]}" ps -q server | head -n 1)"
  server_process=""
  if [ -n "$server_container_id" ]; then
    server_process="$(docker top "$server_container_id" 2>/dev/null | awk 'NR==2 {print $NF}' || true)"
  fi
  if [ -z "$server_process" ]; then
    server_process="unknown"
  fi
  if [ "$server_process" != "dist/main" ] && [ "$server_process" != "main" ]; then
    # Keep as a warning signal without hard-failing the drill.
    result="${result};WARN(process=${server_process})"
  fi

  echo "| $cycle | $start_at | $local_recovery | $public_recovery | $server_process | $result |" >> "$OUTPUT_FILE"

  if [ "$cycle" -lt "$CYCLES" ] && [ "$COOLDOWN_SECONDS" -gt 0 ]; then
    sleep "$COOLDOWN_SECONDS"
  fi
done

echo "$OUTPUT_FILE"
