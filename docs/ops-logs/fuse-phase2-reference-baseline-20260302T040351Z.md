# FUSE Phase 2 Reference Baseline

- Timestamp (UTC): 2026-03-02T04:03:51Z
- Operator: Codex (for Dhruv)
- Branch: integration/reference-parity
- Commit SHA: 9aa04b7a5c

## Goal

Lock a single parity matrix before implementation and run FUSE-200 one slice at a time:

1. Sidebar customization
2. Page layout customization
3. AI agents
4. AI chat
5. Admin panel settings

Sidebar is capability parity (editability + persistence), not object-list parity.
Partner object presence is enforced in FUSE-201.

## Mutation Window Precheck

- Command: `bash packages/twenty-docker/scripts/fuse-phase2-precheck.sh --ack-no-sev1`
- Run time (UTC): `2026-03-02T04:03:51Z`
- Result: PASS
- Public health: `https://app.fusegtm.com/healthz` PASS
- Local health: `http://localhost:3000/healthz` PASS
- Re-run for admin-panel slice (UTC): `2026-03-02T05:40:51Z` PASS
- Explicit EC2 local health check (UTC): `2026-03-02T05:42:30Z` PASS via SSH
- Re-run for capability-parity revision (UTC): `2026-03-02T06:47:56Z` PASS

## Parity Matrix (Single Source of Truth)

| Slice | Parity type | YC | Apple | Production (`app.fusegtm.com`) | Winner (YC/Apple) | One-sentence rationale | Status |
|---|---|---|---|---|---|---|---|
| Sidebar | capability | PASS (core edit actions visible) | PASS (core edit actions visible) | IN_PROGRESS (editability/persistence checks pending in production) | YC | Winner based on control surface and persistence behavior, not matching object inventory. | IN_PROGRESS |
| Page layout | capability | PASS (founder-verified) | PASS (founder-verified) | IN_PROGRESS | TBD | Keep both as references until production behavior is confirmed. | IN_PROGRESS |
| Agents | capability | PASS (founder-verified) | PASS (founder-verified) | IN_PROGRESS | TBD | Agent reliability must be validated in deployed environment before selection. | IN_PROGRESS |
| Chat | capability | PASS (founder-verified) | PASS (founder-verified) | IN_PROGRESS | TBD | Chat winner depends on practical production query quality, not localhost optics. | IN_PROGRESS |
| Admin panel settings | capability | PASS (settings structure documented in `docs/twenty-reference-instance-comparison.md`) | PASS (settings structure documented in `docs/twenty-reference-instance-comparison.md`) | PASS (write-and-revert validated in production; post-check regressions all green) | YC | YC is default winner unless Apple exposes unique control surface needed for customer operations. | PASS |

## Partnership Data Presence Snapshot

This is informational during FUSE-200 and is not a FUSE-200 gate.
Object inventory is enforced in FUSE-201 bootstrap verification.

| Object | YC count | Apple count | Production count | Notes |
|---|---|---|---|---|
| partnerProfile | TBD | TBD | TBD | Collect during slice validation pass |
| partnerPlay | TBD | TBD | TBD | Collect during slice validation pass |
| playCheck | TBD | TBD | TBD | Collect during slice validation pass |
| playEnrichment | TBD | TBD | TBD | Collect during slice validation pass |
| playExclusion | TBD | TBD | TBD | Collect during slice validation pass |
| discoveryRun | TBD | TBD | TBD | Collect during slice validation pass |
| partnerCandidate | TBD | TBD | TBD | Collect during slice validation pass |
| partnerAttributionEvent | TBD | TBD | TBD | Collect during slice validation pass |

## Evidence Links

### YC (`yc.localhost`)

1. `docs/ops-logs/fuse-phase2-reference-yc-sidebar-capture-20260302T041900Z.json`
2. `output/playwright/fuse-phase2-yc-sidebar-20260302T041900Z.png`
3. `output/playwright/fuse-phase2-yc-sidebar-20260302T041900Z.yml`

### Apple (`apple.localhost`)

1. `docs/ops-logs/fuse-phase2-reference-apple-sidebar-capture-20260302T042210Z.json`
2. `output/playwright/fuse-phase2-apple-sidebar-20260302T042210Z.png`
3. `output/playwright/fuse-phase2-apple-sidebar-20260302T042210Z.yml`

### Production (`app.fusegtm.com`)

1. `docs/ops-logs/fuse-phase2-reference-production-sidebar-capture-20260302T050126Z.json`
2. `output/playwright/fuse-phase2-production-sidebar-20260302T050126Z.png`
3. `output/playwright/fuse-phase2-production-sidebar-20260302T050126Z.yml`
4. `output/playwright/fuse-phase2-production-settings-profile-20260302T050400Z.png`
5. `output/playwright/fuse-phase2-production-settings-admin-20260302T050400Z.png`
6. `output/playwright/.playwright-cli/page-2026-03-02T05-39-17-699Z.yml`
7. `output/playwright/.playwright-cli/page-2026-03-02T05-39-17-899Z.png`
8. `output/playwright/.playwright-cli/page-2026-03-02T05-40-38-459Z.yml`
9. `output/playwright/.playwright-cli/page-2026-03-02T05-40-25-900Z.png`

### Slice Logs

1. `docs/ops-logs/fuse-phase2-reference-slice-sidebar-20260302T040351Z.md`
2. `docs/ops-logs/fuse-phase2-reference-slice-admin-panel-20260302T052735Z.md`

## Observed Differences (Slice 1)

1. Sidebar object counts differ across environments and are not used as the sidebar PASS criterion.
2. Sidebar PASS criterion is editability + persistence parity in production (reorder, color, add/remove, no regressions).
3. Page layout (Companies table) differs:
   - YC columns: `Name`, `Creation date`, `Created by`, `Last update`, `Favorites`
   - Apple columns: `Name`, `Domain Name`, `Created by`, `Account Owner`, `Creation date`, `Employees`, `Address`
   - Production columns: `Name`, `Domain Name`, `Created by`, `Account Owner`, `Creation date`, `Employees`, `Linkedin`, `Address`

## Regression Gate

- [x] Google auth flow still works.
- [x] Deploy + health checks still pass.
- [x] Multi-workspace routing still works.
- [x] Admin panel low-risk write-and-revert check passes in production.

## Go/No-Go Decision

- Decision: NO-GO (for FUSE-201+)
- Rationale: production capability preconditions were unblocked by seeding key feature flags and restarting server/worker, but sidebar persistence validation plus page-layout/agents/chat production evidence is still incomplete.
- FUSE-200 gate state: DO NOT MARK PASS until all 5 slices are PASS.
- Next action:
  - Close Slice 1 by validating sidebar editability and persistence in production (reorder, color, add/remove, hard refresh + re-login), then re-capturing evidence.
  - Execute and close Slice 2 (`page-layout`), Slice 3 (`agents`), and Slice 4 (`chat`) with production validation evidence.
