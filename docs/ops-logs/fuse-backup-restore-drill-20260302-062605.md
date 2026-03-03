# Fuse Backup Restore Drill

**Date:** 2026-03-02T11:26:05Z
**Source instance:** fuse-prod-db
**Restore instance:** fuse-restore-drill-failproof-20260302112605
**Region:** us-east-1

## Timeline

- **2026-03-02T11:26:08Z:** Source verified: postgres 15.12, status=available, endpoint=fuse-prod-db.cgnqkm0s4v6f.us-east-1.rds.amazonaws.com
- **2026-03-02T11:26:08Z:** Initiating point-in-time restore → fuse-restore-drill-failproof-20260302112605
- **2026-03-02T11:26:14Z:** Restore initiated (using latest restorable time)
- **2026-03-02T11:26:16Z:** FAIL — Restore instance not available after 1s (status: creating)
- **2026-03-02T11:26:18Z:** Restore instance deletion initiated

## Result

**FAIL** — Restore instance not available after 1s (status: creating)
