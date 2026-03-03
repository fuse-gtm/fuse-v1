# Fuse Ops Script Proof Run

- timestamp_utc: 2026-03-02T11:31:00Z
- scope: restore-drill failure cleanup + restart drill container resolution

## 1) Forced Failure Restore Drill

- script: `packages/twenty-docker/scripts/fuse-backup-restore-drill.sh`
- params: `WAIT_TIMEOUT_SECONDS=1 SKIP_CLEANUP=false`
- restore_instance: `fuse-restore-drill-failproof-20260302112605`
- expected: fail fast after restore creation, then auto-delete restored instance via trap cleanup
- evidence artifact: [fuse-backup-restore-drill-20260302-062605.md](/Users/dhruvraina/fuse-platform/docs/ops-logs/fuse-backup-restore-drill-20260302-062605.md)

### Post-check

- `aws rds describe-db-instances --db-instance-identifier fuse-restore-drill-failproof-20260302112605`
- result: `DBInstanceNotFound`

Interpretation: non-zero + `DBInstanceNotFound` confirms cleanup completed and no orphaned restore instance remains.

## 2) Restart Drill With Explicit Compose Project Context

- script: `packages/twenty-docker/scripts/fuse-runtime-restart-drill.sh`
- params: `COMPOSE_PROJECT_NAME=twenty CYCLES=1 VERIFY_PUBLIC=true`
- expected: server restarts, health recovers, process detected via compose-resolved container ID (no hardcoded container name)
- evidence artifact: [fuse-runtime-restart-drill-20260302T112730Z-explicit-project.md](/Users/dhruvraina/fuse-platform/docs/ops-logs/fuse-runtime-restart-drill-20260302T112730Z-explicit-project.md)

## 3) Current Health

- public healthz: `{"status":"ok"}`
- local healthz: `{"status":"ok"}`
