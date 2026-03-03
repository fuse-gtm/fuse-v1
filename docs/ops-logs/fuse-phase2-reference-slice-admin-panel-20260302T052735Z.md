# FUSE-200 Slice 5: Admin Panel Settings Parity

- Timestamp (UTC): 2026-03-02T05:27:35Z
- Branch: integration/reference-parity
- Planned PR title: FUSE-200: reference parity (admin-panel-settings)
- Operator: Codex (for Dhruv)

## Goal

Verify production admin panel settings expose the same control surface as YC/Apple and validate one low-risk write-and-revert operation.

Note: in multi-workspace mode, production admin settings resolve on workspace domain `https://fusegtm.fusegtm.com/settings/admin-panel#ai` after auth.

## Scope

1. Access and stability of `/settings/admin-panel`
2. Admin AI controls parity:
   - auto-enable new models toggle
   - per-model availability controls
3. One low-risk write-and-revert check in production

Out of scope:

1. Sidebar parity
2. Page layout parity
3. Agent/chat quality tuning

## Workspace-state Reproduction Steps

1. Capture YC admin panel controls.
2. Capture Apple admin panel controls.
3. Capture production admin panel controls.
4. Compare control classes and log parity status.
5. Execute one low-risk setting write-and-revert in production.
6. Run post-checks (health, auth, routing).

## Current Evidence

### YC (`yc.localhost`)

1. Reference control inventory: `docs/twenty-reference-instance-comparison.md` (Sections 6 and 7.8)

### Apple (`apple.localhost`)

1. Reference control inventory: `docs/twenty-reference-instance-comparison.md` (Sections 6 and 7.8)

### Production (`app.fusegtm.com`)

1. `output/playwright/fuse-phase2-production-settings-admin-20260302T050400Z.png`
2. `output/playwright/fuse-phase2-production-settings-profile-20260302T050400Z.png`
3. `output/playwright/.playwright-cli/page-2026-03-02T05-39-17-699Z.yml` (AI tab snapshot after write; toggle set to false)
4. `output/playwright/.playwright-cli/page-2026-03-02T05-39-17-899Z.png` (AI tab screenshot after write)
5. `output/playwright/.playwright-cli/page-2026-03-02T05-40-38-459Z.yml` (AI tab snapshot after revert; toggle restored to true)
6. `output/playwright/.playwright-cli/page-2026-03-02T05-40-25-900Z.png` (AI tab screenshot after revert)

## Control Parity Matrix

| Control class | YC | Apple | Production | Notes |
|---|---|---|---|---|
| Admin panel page opens | PASS | PASS | PASS | Production auth+settings navigation previously verified |
| Auto-enable new models toggle present | PASS | PASS | PASS | Verified on production AI tab snapshot (`ref=e343`) |
| Per-model availability controls present | PASS | PASS | PASS | Verified on production AI tab snapshot (`All Models` list + per-model toggles) |
| Low-risk setting write-and-revert | PASS | PASS | PASS | Production toggle executed and reverted without regressions |

## Write-and-Revert Log (Production)

1. Setting selected: `Automatically enable new models` (Admin Panel -> AI)
2. Original value: `true`
3. Temporary value applied: `false`
4. Reverted to original: `YES`
5. Timestamps (UTC):
   - write completed: `2026-03-02T05:38:28Z`
   - revert confirmed: `2026-03-02T05:40:33Z`
6. State checks:
   - post-write: `eval "el => el.checked" e343` -> `false`
   - post-revert: `eval "el => el.checked" e343` -> `true`

## Post-Change Regression Checks

1. Phase 2 precheck:
   - command: `bash packages/twenty-docker/scripts/fuse-phase2-precheck.sh --ack-no-sev1`
   - result: PASS at `2026-03-02T05:40:51Z`
2. Google OAuth redirect:
   - command: `curl -s -o /dev/null -w "status=%{http_code} redirect=%{redirect_url}\n" https://app.fusegtm.com/auth/google`
   - result: `status=302` with redirect to `accounts.google.com`
3. Multi-workspace routing:
   - command: `curl -s -o /dev/null -w "status=%{http_code}\n" https://fusegtm.fusegtm.com/healthz`
   - result: `status=200`
4. Production local health (EC2 via SSH):
   - command: `ssh -i ~/.ssh/fuse-prod.pem ubuntu@52.20.136.71 "curl -fsS http://localhost:3000/healthz"`
   - result: `{"status":"ok","info":{},"error":{},"details":{}}`

## Validation Checklist

- [x] `yc.localhost` admin panel controls documented
- [x] `apple.localhost` admin panel controls documented
- [x] `app.fusegtm.com` admin panel settings parity PASS
- [x] Low-risk production setting write-and-revert PASS
- [x] Google auth flow unaffected
- [x] Deploy/health checks unaffected
- [x] Multi-workspace routing unaffected

## Rollback Notes

If any admin setting change causes regression:

1. Revert setting immediately.
2. Re-run public/local health checks.
3. Re-run Google auth and workspace routing checks.
4. Mark slice status FAIL and keep PR open.

## Status

- Current: PASS
- Blocker: none
- Next action: keep this slice frozen; do not modify admin AI controls again until FUSE-200 closes.
