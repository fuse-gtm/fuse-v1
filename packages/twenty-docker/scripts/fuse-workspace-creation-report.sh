#!/usr/bin/env bash
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SELF_DIR}/../../.." && pwd)"
cd "$REPO_ROOT"

ENV_FILE="${ENV_FILE:-packages/twenty-docker/.env}"
THRESHOLD_HOURS="${THRESHOLD_HOURS:-24}"
OUTPUT_DIR="${OUTPUT_DIR:-docs/ops-logs}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUTPUT_FILE="${OUTPUT_DIR}/fuse-workspace-creation-report-${TIMESTAMP}.md"

fail() {
  echo "Workspace creation report failed: $1" >&2
  exit 1
}

for cmd in psql date; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    fail "missing required command: ${cmd}"
  fi
done

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if [ -z "${PG_DATABASE_URL:-}" ]; then
  fail "PG_DATABASE_URL is required"
fi

mkdir -p "$OUTPUT_DIR"

QUERY="
SELECT
  id,
  subdomain,
  activationStatus,
  createdAt,
  EXTRACT(EPOCH FROM (NOW() - createdAt)) / 3600 AS age_hours
FROM core.workspace
WHERE activationStatus IN ('PENDING_CREATION', 'ONGOING_CREATION')
  AND createdAt < NOW() - INTERVAL '${THRESHOLD_HOURS} hours'
ORDER BY createdAt ASC;
"

RAW_ROWS="$(psql "${PG_DATABASE_URL}" -At -F '|' -c "$QUERY")"
HAS_STUCK_WORKSPACES=false

if [ -n "$RAW_ROWS" ]; then
  HAS_STUCK_WORKSPACES=true
fi

{
  echo "# Workspace Creation Aging Report"
  echo
  echo "- Generated (UTC): ${TIMESTAMP}"
  echo "- Threshold (hours): ${THRESHOLD_HOURS}"
  echo

  if [ "$HAS_STUCK_WORKSPACES" = "false" ]; then
    echo "No stuck workspaces found."
  else
    echo "## Stuck Workspaces"
    echo
    echo "| Workspace ID | Subdomain | Status | Created At | Age (hours) |"
    echo "|---|---|---|---|---|"

    while IFS='|' read -r id subdomain status created_at age_hours; do
      rounded_age="$(printf '%.1f' "$age_hours")"
      echo "| ${id} | ${subdomain} | ${status} | ${created_at} | ${rounded_age} |"
    done <<< "$RAW_ROWS"
  fi
} > "$OUTPUT_FILE"

echo "Report written: ${OUTPUT_FILE}"

if [ "$HAS_STUCK_WORKSPACES" = "true" ]; then
  echo "Found workspace creation records older than ${THRESHOLD_HOURS}h" >&2
  exit 10
fi
