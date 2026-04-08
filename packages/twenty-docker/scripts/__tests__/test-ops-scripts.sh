#!/usr/bin/env bash
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SELF_DIR}/../../../.." && pwd)"
RESTORE_SCRIPT="${REPO_ROOT}/packages/twenty-docker/scripts/fuse-backup-restore-drill.sh"
RESTART_SCRIPT="${REPO_ROOT}/packages/twenty-docker/scripts/fuse-runtime-restart-drill.sh"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

assert_contains() {
  local file="$1"
  local expected="$2"
  if ! grep -F -- "$expected" "$file" >/dev/null 2>&1; then
    fail "Expected '${expected}' in ${file}"
  fi
}

run_test_restore_cleanup_on_failure() {
  local tmp
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' RETURN

  local mock_bin="$tmp/bin"
  mkdir -p "$mock_bin" "$tmp/out"

  cat > "$mock_bin/aws" <<'AWS'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "${MOCK_AWS_LOG}"

if [[ "$*" == *"rds describe-db-instances"* && "$*" == *"--db-instance-identifier fuse-prod-db"* && "$*" == *"Status:DBInstanceStatus"* ]]; then
  echo '{"Status":"available","Engine":"postgres","EngineVersion":"15.12","Endpoint":"fuse-prod-db.example"}'
  exit 0
fi

if [[ "$*" == *"rds describe-db-instances"* && "$*" == *"Class:DBInstanceClass"* ]]; then
  echo '{"Class":"db.t3.micro","SubnetGroup":"default","VpcSecurityGroups":["sg-1"]}'
  exit 0
fi

if [[ "$*" == *"rds restore-db-instance-to-point-in-time"* ]]; then
  touch "${MOCK_RESTORE_CREATED_FILE}"
  echo '{}'
  exit 0
fi

if [[ "$*" == *"rds describe-db-instances"* && "$*" == *"--db-instance-identifier fuse-restore-drill-test"* && "$*" == *"--output text"* ]]; then
  echo 'creating'
  exit 0
fi

if [[ "$*" == *"rds delete-db-instance"* ]]; then
  touch "${MOCK_DELETE_CALLED_FILE}"
  echo '{}'
  exit 0
fi

echo '{}'
AWS

  cat > "$mock_bin/jq" <<'JQ'
#!/usr/bin/env bash
set -euo pipefail
query="${2:-}"
cat >/dev/null || true
case "$query" in
  .Status) echo "available" ;;
  *"EngineVersion"*) echo "postgres 15.12" ;;
  .Endpoint) echo "fuse-prod-db.example" ;;
  .Class) echo "db.t3.micro" ;;
  .SubnetGroup) echo "default" ;;
  *"VpcSecurityGroups"*) echo "sg-1" ;;
  *) echo "" ;;
esac
JQ

  cat > "$mock_bin/psql" <<'PSQL'
#!/usr/bin/env bash
set -euo pipefail
# Not reached in this failure-path test.
exit 1
PSQL

  chmod +x "$mock_bin/aws" "$mock_bin/jq" "$mock_bin/psql"

  export MOCK_AWS_LOG="$tmp/aws.log"
  export MOCK_RESTORE_CREATED_FILE="$tmp/restore-created"
  export MOCK_DELETE_CALLED_FILE="$tmp/delete-called"

  if PATH="$mock_bin:$PATH" \
    SOURCE_DB_INSTANCE="fuse-prod-db" \
    RESTORE_DB_INSTANCE="fuse-restore-drill-test" \
    DB_PASSWORD="test-password" \
    WAIT_TIMEOUT_SECONDS=0 \
    SKIP_CLEANUP=false \
    OUTPUT_DIR="$tmp/out" \
    /bin/bash "$RESTORE_SCRIPT" >"$tmp/restore.log" 2>&1; then
    fail "Expected restore drill to fail for timeout path"
  fi

  [ -f "$MOCK_RESTORE_CREATED_FILE" ] || fail "Expected restore to be created before timeout"
  [ -f "$MOCK_DELETE_CALLED_FILE" ] || fail "Expected cleanup delete to run on failure"
}

run_test_restore_preflight_requires_psql() {
  local tmp
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' RETURN

  local mock_bin="$tmp/bin"
  mkdir -p "$mock_bin"

  cat > "$mock_bin/aws" <<'AWS'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "${MOCK_AWS_LOG}"
exit 0
AWS

  cat > "$mock_bin/jq" <<'JQ'
#!/usr/bin/env bash
set -euo pipefail
exit 0
JQ

  chmod +x "$mock_bin/aws" "$mock_bin/jq"

  local path_without_psql=""
  local path_segment
  OLD_IFS="$IFS"
  IFS=':'
  for path_segment in $PATH; do
    if [ -x "${path_segment}/psql" ]; then
      continue
    fi
    if [ -z "$path_without_psql" ]; then
      path_without_psql="$path_segment"
    else
      path_without_psql="${path_without_psql}:${path_segment}"
    fi
  done
  IFS="$OLD_IFS"

  export MOCK_AWS_LOG="$tmp/aws.log"

  if PATH="$mock_bin:$path_without_psql" \
    DB_PASSWORD="test-password" \
    SOURCE_DB_INSTANCE="fuse-prod-db" \
    RESTORE_DB_INSTANCE="fuse-restore-drill-test" \
    OUTPUT_DIR="$tmp/out" \
    /bin/bash "$RESTORE_SCRIPT" >"$tmp/preflight.log" 2>&1; then
    fail "Expected preflight to fail when psql is unavailable"
  fi

  assert_contains "$tmp/preflight.log" "ERROR: psql not found"
  if [ -s "$MOCK_AWS_LOG" ]; then
    fail "aws should not be called when preflight fails"
  fi
}

run_test_restart_drill_uses_dynamic_container_id() {
  local tmp
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' RETURN

  local mock_bin="$tmp/bin"
  mkdir -p "$mock_bin"

  cat > "$mock_bin/docker" <<'DOCKER'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "${MOCK_DOCKER_LOG}"

if [ "${1:-}" = "compose" ]; then
  if [[ "$*" == *" restart server"* ]]; then
    exit 0
  fi
  if [[ "$*" == *" ps -q server"* ]]; then
    echo "container-abc123"
    exit 0
  fi
fi

if [ "${1:-}" = "top" ] && [ "${2:-}" = "container-abc123" ]; then
  cat <<'TOP'
PID USER TIME COMMAND
1 root 0:00 dist/main
TOP
  exit 0
fi

echo "Unexpected docker call: $*" >&2
exit 1
DOCKER

  cat > "$mock_bin/curl" <<'CURL'
#!/usr/bin/env bash
set -euo pipefail
exit 0
CURL

  chmod +x "$mock_bin/docker" "$mock_bin/curl"

  local env_file="$tmp/test.env"
  local output_file="$tmp/restart-drill.md"
  touch "$env_file"

  export MOCK_DOCKER_LOG="$tmp/docker.log"

  PATH="$mock_bin:$PATH" \
    ENV_FILE="$env_file" \
    CYCLES=1 \
    VERIFY_PUBLIC=false \
    CHECK_HOST_FREE_MEM=false \
    OUTPUT_FILE="$output_file" \
    /bin/bash "$RESTART_SCRIPT" >/dev/null

  assert_contains "$tmp/docker.log" "compose -f packages/twenty-docker/docker-compose.yml -f packages/twenty-docker/docker-compose.fuse.yml -f packages/twenty-docker/docker-compose.aws.yml --env-file ${env_file} ps -q server"
  assert_contains "$tmp/docker.log" "top container-abc123"
  assert_contains "$RESTART_SCRIPT" "--max-time"
  assert_contains "$output_file" "dist/main"
  assert_contains "$output_file" "PASS"
}

run_test_restore_cleanup_on_failure
run_test_restore_preflight_requires_psql
run_test_restart_drill_uses_dynamic_container_id

echo "PASS: ops script tests"
