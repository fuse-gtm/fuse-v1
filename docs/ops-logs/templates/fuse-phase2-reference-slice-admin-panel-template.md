# FUSE-200 Slice: Admin Panel Settings Parity

- Timestamp (UTC): `<yyyy-mm-ddThh:mm:ssZ>`
- Branch: `integration/reference-parity`
- Planned PR title: `FUSE-200: reference parity (admin-panel-settings)`
- Operator: `<name>`

## Goal

Verify production admin controls match YC/Apple control classes and that one low-risk setting can be changed and reverted safely.

## Scope

1. Admin panel access at `/settings/admin-panel`
2. AI model controls parity:
   - auto-enable new models
   - per-model availability list
3. One low-risk write-and-revert check in production

Out of scope:

1. Sidebar configuration
2. Page layout configuration
3. Agent/chat prompt quality tuning

## Workspace-state Reproduction Steps

1. Capture YC admin panel screenshots and notes.
2. Capture Apple admin panel screenshots and notes.
3. Capture production admin panel screenshots and notes.
4. Compare control classes and record parity result.
5. In production, toggle one low-risk setting and revert it.
6. Run regression checks and capture outputs.

## Control Parity Matrix

| Control class | YC | Apple | Production | Notes |
|---|---|---|---|---|
| Admin panel page opens | PASS/FAIL | PASS/FAIL | PASS/FAIL |  |
| Auto-enable new models toggle present | PASS/FAIL | PASS/FAIL | PASS/FAIL |  |
| Per-model availability controls present | PASS/FAIL | PASS/FAIL | PASS/FAIL |  |
| Settings update applies | PASS/FAIL | PASS/FAIL | PASS/FAIL |  |

## Write-and-Revert Log (Production)

1. Setting selected: `<name>`
2. Original value: `<value>`
3. Temporary value applied: `<value>`
4. Reverted to original: `YES/NO`
5. Timestamps (UTC):
   - write: `<time>`
   - revert: `<time>`

## Captured Evidence

### YC (`yc.localhost`)

1. `<screenshot/file/path>`
2. `<notes/file/path>`

### Apple (`apple.localhost`)

1. `<screenshot/file/path>`
2. `<notes/file/path>`

### Production (`app.fusegtm.com`)

1. `<screenshot/file/path>`
2. `<notes/file/path>`
3. `<health-check-output/path>`

## Validation Checklist

- [ ] `yc.localhost` admin panel settings parity PASS
- [ ] `apple.localhost` admin panel settings parity PASS
- [ ] `app.fusegtm.com` admin panel settings parity PASS
- [ ] Low-risk production setting write-and-revert PASS
- [ ] Google auth flow unaffected
- [ ] Deploy/health checks unaffected
- [ ] Multi-workspace routing unaffected

## Rollback Notes

If admin panel behavior regresses:

1. Revert changed setting to known-good value.
2. Re-run public/local health checks.
3. Re-run auth and routing checks.
4. Mark slice status FAIL and keep PR open.

## Status

- Current: `IN_PROGRESS/PASS/FAIL`
- Blocker: `<if any>`
- Next action: `<single next action>`
