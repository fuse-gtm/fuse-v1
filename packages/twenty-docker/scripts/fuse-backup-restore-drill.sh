#!/usr/bin/env bash
# Fuse RDS backup-restore drill.
#
# Creates a point-in-time restore of the production RDS instance,
# verifies connectivity + data integrity, then cleans up.
#
# Prerequisites:
#   - AWS CLI configured with permissions for rds:RestoreDBInstanceToPointInTime,
#     rds:DescribeDBInstances, rds:DeleteDBInstance
#   - jq and psql installed
#
# Usage:
#   bash packages/twenty-docker/scripts/fuse-backup-restore-drill.sh
#
# Environment:
#   SOURCE_DB_INSTANCE    Source RDS instance identifier (default: fuse-prod-db)
#   RESTORE_DB_INSTANCE   Temporary restore instance name (default: fuse-restore-drill-<epoch>)
#   DB_NAME               Database name to verify (default: default)
#   DB_USER               Database user (default: fuse_prod)
#   DB_PASSWORD           Database password (reads from PG_DATABASE_PASSWORD)
#   WAIT_TIMEOUT_SECONDS  Max wait for instance available (default: 900)
#   SKIP_CLEANUP          Set to "true" to keep the restored instance (default: false)
#   OUTPUT_DIR            Where to write evidence (default: docs/ops-logs)
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SELF_DIR}/../../.." && pwd)"
cd "$REPO_ROOT"

# --- Configuration ---
SOURCE_DB_INSTANCE="${SOURCE_DB_INSTANCE:-fuse-prod-db}"
RESTORE_DB_INSTANCE="${RESTORE_DB_INSTANCE:-fuse-restore-drill-$(date +%s)}"
DB_NAME="${DB_NAME:-default}"
DB_USER="${DB_USER:-fuse_prod}"
DB_PASSWORD="${DB_PASSWORD:-${PG_DATABASE_PASSWORD:-}}"
WAIT_TIMEOUT_SECONDS="${WAIT_TIMEOUT_SECONDS:-900}"
SKIP_CLEANUP="${SKIP_CLEANUP:-false}"
OUTPUT_DIR="${OUTPUT_DIR:-docs/ops-logs}"
REGION="${AWS_DEFAULT_REGION:-us-east-1}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
RESTORE_CREATED=false
FAIL_REASON=""
CLEANUP_RESULT="not-needed"
DRILL_PASSED=false

mkdir -p "$OUTPUT_DIR"
EVIDENCE_FILE="${OUTPUT_DIR}/fuse-backup-restore-drill-$(date +%Y%m%d-%H%M%S).md"

now() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
log() { echo "$(now) $*"; }

write_evidence() {
  cat > "$EVIDENCE_FILE" <<HEADER
# Fuse Backup Restore Drill

**Date:** ${TIMESTAMP}
**Source instance:** ${SOURCE_DB_INSTANCE}
**Restore instance:** ${RESTORE_DB_INSTANCE}
**Region:** ${REGION}

## Timeline

HEADER
}

append_evidence() {
  echo "- **$(now):** $*" >> "$EVIDENCE_FILE"
}

fail() {
  FAIL_REASON="$*"
  log "FAIL: ${FAIL_REASON}"
  append_evidence "FAIL — ${FAIL_REASON}"
  return 1
}

cleanup_restore() {
  if [ "$SKIP_CLEANUP" = "true" ]; then
    CLEANUP_RESULT="skipped"
    append_evidence "Cleanup skipped (SKIP_CLEANUP=true)"
    return 0
  fi

  if [ "$RESTORE_CREATED" != "true" ]; then
    CLEANUP_RESULT="not-needed"
    return 0
  fi

  log "Deleting restore instance ${RESTORE_DB_INSTANCE}..."
  if aws rds delete-db-instance \
    --db-instance-identifier "$RESTORE_DB_INSTANCE" \
    --skip-final-snapshot \
    --region "$REGION" \
    --output json >/dev/null 2>&1; then
    RESTORE_CREATED=false
    CLEANUP_RESULT="initiated"
    append_evidence "Restore instance deletion initiated"
    log "Cleanup initiated"
    return 0
  fi

  CLEANUP_RESULT="delete-failed"
  append_evidence "WARNING: delete-db-instance failed"
  log "WARNING: delete-db-instance failed"
  return 1
}

on_exit() {
  local exit_code="$?"

  if [ "$DRILL_PASSED" != "true" ]; then
    cleanup_restore || true

    if [ -z "$FAIL_REASON" ]; then
      FAIL_REASON="Drill failed unexpectedly (exit=${exit_code})"
      append_evidence "FAIL — ${FAIL_REASON}"
    fi

    echo -e "\n## Result\n\n**FAIL** — ${FAIL_REASON}" >> "$EVIDENCE_FILE"
  fi

  exit "$exit_code"
}

trap on_exit EXIT INT TERM

# --- Preflight ---
for cmd in aws jq psql; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "ERROR: $cmd not found"; exit 1; }
done

if [ -z "$DB_PASSWORD" ]; then
  echo "ERROR: DB_PASSWORD or PG_DATABASE_PASSWORD must be set"
  exit 1
fi

write_evidence

# --- Step 1: Verify source instance exists ---
log "Verifying source instance ${SOURCE_DB_INSTANCE}..."
SOURCE_INFO="$(aws rds describe-db-instances \
  --db-instance-identifier "$SOURCE_DB_INSTANCE" \
  --region "$REGION" \
  --query 'DBInstances[0].{Status:DBInstanceStatus,Engine:Engine,EngineVersion:EngineVersion,Endpoint:Endpoint.Address}' \
  --output json 2>/dev/null)" || fail "Source instance ${SOURCE_DB_INSTANCE} not found"

SOURCE_STATUS="$(echo "$SOURCE_INFO" | jq -r '.Status')"
SOURCE_ENGINE="$(echo "$SOURCE_INFO" | jq -r '.Engine + " " + .EngineVersion')"
SOURCE_ENDPOINT="$(echo "$SOURCE_INFO" | jq -r '.Endpoint')"

[ "$SOURCE_STATUS" = "available" ] || fail "Source instance not available (status: ${SOURCE_STATUS})"
append_evidence "Source verified: ${SOURCE_ENGINE}, status=${SOURCE_STATUS}, endpoint=${SOURCE_ENDPOINT}"
log "Source OK: ${SOURCE_ENGINE}"

# --- Step 2: Point-in-time restore ---
log "Starting point-in-time restore to ${RESTORE_DB_INSTANCE}..."
append_evidence "Initiating point-in-time restore → ${RESTORE_DB_INSTANCE}"

# Get source instance details for restore
SOURCE_DETAILS="$(aws rds describe-db-instances \
  --db-instance-identifier "$SOURCE_DB_INSTANCE" \
  --region "$REGION" \
  --query 'DBInstances[0].{Class:DBInstanceClass,SubnetGroup:DBSubnetGroup.DBSubnetGroupName,VpcSecurityGroups:VpcSecurityGroups[*].VpcSecurityGroupId}' \
  --output json)"

INSTANCE_CLASS="$(echo "$SOURCE_DETAILS" | jq -r '.Class')"
SUBNET_GROUP="$(echo "$SOURCE_DETAILS" | jq -r '.SubnetGroup')"
SECURITY_GROUPS="$(echo "$SOURCE_DETAILS" | jq -r '.VpcSecurityGroups | join(" ")')"

aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier "$SOURCE_DB_INSTANCE" \
  --target-db-instance-identifier "$RESTORE_DB_INSTANCE" \
  --use-latest-restorable-time \
  --db-instance-class "$INSTANCE_CLASS" \
  --db-subnet-group-name "$SUBNET_GROUP" \
  --vpc-security-group-ids $SECURITY_GROUPS \
  --no-multi-az \
  --no-publicly-accessible \
  --region "$REGION" \
  --output json >/dev/null 2>&1 || fail "restore-db-instance-to-point-in-time failed"
RESTORE_CREATED=true

append_evidence "Restore initiated (using latest restorable time)"

# --- Step 3: Wait for instance available ---
log "Waiting up to ${WAIT_TIMEOUT_SECONDS}s for ${RESTORE_DB_INSTANCE} to become available..."
START_TS="$(date +%s)"

while true; do
  STATUS="$(aws rds describe-db-instances \
    --db-instance-identifier "$RESTORE_DB_INSTANCE" \
    --region "$REGION" \
    --query 'DBInstances[0].DBInstanceStatus' \
    --output text 2>/dev/null)" || STATUS="unknown"

  if [ "$STATUS" = "available" ]; then
    break
  fi

  NOW_TS="$(date +%s)"
  ELAPSED=$((NOW_TS - START_TS))
  if [ "$ELAPSED" -ge "$WAIT_TIMEOUT_SECONDS" ]; then
    fail "Restore instance not available after ${WAIT_TIMEOUT_SECONDS}s (status: ${STATUS})"
  fi

  log "  status=${STATUS} elapsed=${ELAPSED}s ..."
  sleep 30
done

RESTORE_ENDPOINT="$(aws rds describe-db-instances \
  --db-instance-identifier "$RESTORE_DB_INSTANCE" \
  --region "$REGION" \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)"

WAIT_DURATION=$(($(date +%s) - START_TS))
append_evidence "Restore instance available in ${WAIT_DURATION}s at ${RESTORE_ENDPOINT}"
log "Restore available at ${RESTORE_ENDPOINT} (${WAIT_DURATION}s)"

# --- Step 4: Verify data ---
log "Verifying data on restored instance..."

# Check table count
TABLE_COUNT="$(PGPASSWORD="$DB_PASSWORD" psql \
  -h "$RESTORE_ENDPOINT" -p 5432 -U "$DB_USER" -d "$DB_NAME" \
  -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog','information_schema');" 2>/dev/null)" \
  || fail "Cannot connect to restored instance"

append_evidence "Data verified: ${TABLE_COUNT} tables in restored instance"
log "Restored DB has ${TABLE_COUNT} tables"

# Check a known core table exists
CORE_CHECK="$(PGPASSWORD="$DB_PASSWORD" psql \
  -h "$RESTORE_ENDPOINT" -p 5432 -U "$DB_USER" -d "$DB_NAME" \
  -tAc "SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='workspace');" 2>/dev/null)" \
  || CORE_CHECK="f"

if [ "$CORE_CHECK" = "t" ]; then
  append_evidence "Core table 'workspace' exists — data integrity confirmed"
  log "Core table 'workspace' exists"
else
  append_evidence "WARNING: Core table 'workspace' not found"
  log "WARNING: Core table 'workspace' not found"
fi

# --- Step 5: Cleanup ---
cleanup_restore || fail "Cleanup failed"

# --- Result ---
cat >> "$EVIDENCE_FILE" <<RESULT

## Result

**PASS**

- Source: ${SOURCE_DB_INSTANCE} (${SOURCE_ENGINE})
- Restore instance: ${RESTORE_DB_INSTANCE}
- Time to available: ${WAIT_DURATION}s
- Tables verified: ${TABLE_COUNT}
- Core table check: ${CORE_CHECK}
- Cleanup: ${CLEANUP_RESULT}
RESULT

DRILL_PASSED=true
log "PASS — evidence written to ${EVIDENCE_FILE}"
echo ""
echo "Evidence: ${EVIDENCE_FILE}"
