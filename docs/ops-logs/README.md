# Ops Logs

This folder stores operational evidence logs for production drills and gates.

Current expected artifacts:

- `fuse-deploy-rollback-<timestamp>.md` from `packages/twenty-docker/scripts/fuse-deploy-rollback-drill.sh`
- completed copy of `docs/fuse-phase1-soak-log-template.md` (if you choose to duplicate into this folder)
- `fuse-phase2-reference-baseline-<timestamp>.md`
- `fuse-phase2-reference-slice-sidebar-<timestamp>.md`
- `fuse-phase2-reference-slice-page-layout-<timestamp>.md`
- `fuse-phase2-reference-slice-agents-<timestamp>.md`
- `fuse-phase2-reference-slice-chat-<timestamp>.md`
- `fuse-phase2-reference-slice-admin-panel-<timestamp>.md`
- `fuse-phase2-bootstrap-<timestamp>.md`
- `fuse-phase2-schema-freeze-<timestamp>.md`
- `fuse-phase2-views-<timestamp>.md`
- `fuse-phase2-seed-<timestamp>.md`
- `fuse-phase2-terminology-<timestamp>.md`
- `fuse-phase2-fuse-206-checkpoint-<timestamp>.md`
- `fuse-phase2-closeout-<date>.md`
- `fuse-runtime-outage-remediation-<timestamp>.md`
- `fuse-runtime-restart-drill-<timestamp>.md`
- `fuse-mcp-bootstrap-hardening-<timestamp>.md`

Keep logs in git for auditability of release readiness decisions.

## Templates

Phase 2 templates live in `docs/ops-logs/templates/`.
Notable parity templates:

- `fuse-phase2-reference-baseline-template.md`
- `fuse-phase2-reference-slice-admin-panel-template.md`
- `fuse-runtime-outage-remediation-template.md`
- `fuse-runtime-restart-drill-template.md`
- `fuse-mcp-bootstrap-hardening-template.md`

Use them directly to avoid drift between operators:

```bash
cp docs/ops-logs/templates/fuse-phase2-bootstrap-template.md \
  docs/ops-logs/fuse-phase2-bootstrap-$(date -u +%Y%m%dT%H%M%SZ).md
```
