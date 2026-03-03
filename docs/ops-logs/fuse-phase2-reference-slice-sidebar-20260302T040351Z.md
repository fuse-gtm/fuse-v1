# FUSE-200 Slice 1: Sidebar Parity

- Timestamp (UTC): 2026-03-02T04:03:51Z
- Branch: integration/reference-parity
- Planned PR title: FUSE-200: reference parity (sidebar)
- Operator: Codex (for Dhruv)

## Goal

Validate sidebar capability parity using YC/Apple references, then confirm production can perform and persist core sidebar edits.

## Scope

1. Sidebar nav ordering
2. Sidebar color customization
3. Sidebar add/remove menu-item behavior
4. Persistence after hard refresh + re-login

Out of scope:

1. Page layout
2. Agents
3. Chat

## Workspace-state Reproduction Steps

1. Capture sidebar structure in YC (`yc.localhost`) with screenshot + snapshot evidence.
2. Capture sidebar structure in Apple (`apple.localhost`) with screenshot + snapshot evidence.
3. In production (`app.fusegtm.com`), run one editability cycle:
   - reorder one item
   - change one item color
   - add then remove one menu item
4. Hard refresh and re-login.
5. Capture post-change screenshots and confirm edits persist.

## Captured Evidence

### YC

1. `docs/ops-logs/fuse-phase2-reference-yc-sidebar-capture-20260302T041900Z.json`
2. `output/playwright/fuse-phase2-yc-sidebar-20260302T041900Z.png`
3. `output/playwright/fuse-phase2-yc-sidebar-20260302T041900Z.yml`

Sidebar summary: reference environment supports full sidebar edit controls used in this slice.

### Apple

1. `docs/ops-logs/fuse-phase2-reference-apple-sidebar-capture-20260302T042210Z.json`
2. `output/playwright/fuse-phase2-apple-sidebar-20260302T042210Z.png`
3. `output/playwright/fuse-phase2-apple-sidebar-20260302T042210Z.yml`

Sidebar summary: reference environment supports full sidebar edit controls used in this slice.

### Production

1. `docs/ops-logs/fuse-phase2-reference-production-sidebar-capture-20260302T050126Z.json`
2. `output/playwright/fuse-phase2-production-sidebar-20260302T050126Z.png`
3. `output/playwright/fuse-phase2-production-sidebar-20260302T050126Z.yml`
4. `output/playwright/fuse-phase2-production-settings-profile-20260302T050400Z.png`
5. `output/playwright/fuse-phase2-production-settings-admin-20260302T050400Z.png`

Observed state: authenticated workspace is reachable and Settings/Admin Panel are accessible; production editability+persistence cycle is pending.

## Difference Notes

1. Object count differences are informational only and not used as sidebar PASS criteria.
2. Sidebar PASS criteria are editability + persistence in production:
   - reorder persists after hard refresh
   - color update persists after hard refresh
   - add/remove cycle succeeds without nav breakage
3. Companies page layout differs (tracked in page-layout slice):
   - YC uses a minimal column set
   - Apple and production both use richer company fields, but production has `Linkedin` and still lacks parity with the selected YC baseline

## Validation Checklist

- [x] `yc.localhost` sidebar parity PASS
- [x] `apple.localhost` sidebar parity PASS
- [ ] `app.fusegtm.com` reorder action works and persists after hard refresh
- [ ] `app.fusegtm.com` color action works and persists after hard refresh
- [ ] `app.fusegtm.com` add/remove cycle works without nav breakage
- [ ] `app.fusegtm.com` re-login confirms persistence
- [x] Google auth flow unaffected
- [x] Deploy/health checks unaffected
- [x] Multi-workspace routing unaffected

## Rollback Notes

If production navigation regresses:

1. Revert to previous sidebar ordering/configuration in workspace settings.
2. Re-run health and auth smoke checks.
3. Mark slice status as FAIL and keep PR open.

## Status

- Current: IN_PROGRESS
- Blocker: production sidebar editability+persistence cycle is not yet evidenced.
- Implementation update (UTC `2026-03-02T06:24:46Z`):
  - Added idempotent Partner OS sidebar backfill to `workspace:bootstrap:partner-os` (code path now ensures missing workspace-level navigation menu items for existing Partner OS objects).
  - Updated command description to explicitly include sidebar navigation bootstrap.
- Next action:
  1. Run production sidebar editability cycle (reorder, color, add/remove).
  2. Hard refresh + re-login and confirm persistence.
  3. Re-capture production evidence.
  4. Re-evaluate this slice against YC capability baseline.
