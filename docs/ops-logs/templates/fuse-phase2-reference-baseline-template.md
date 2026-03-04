# FUSE Phase 2 Reference Baseline

- Timestamp (UTC): `<yyyy-mm-ddThh:mm:ssZ>`
- Operator: `<name>`
- Branch: `integration/reference-parity`
- Commit SHA: `<sha>`

## Goal

State whether this run confirms parity for:

1. Sidebar customization
2. Page layout customization
3. AI agents
4. AI chat
5. Admin panel settings

Sidebar must be capability parity (editability + persistence), not object-list parity.
Partner object inventory is enforced in FUSE-201.

## Parity Matrix (Single Source of Truth)

| Slice | Parity type | YC | Apple | Production (`app.fusegtm.com`) | Winner (YC/Apple) | One-sentence rationale | Status |
|---|---|---|---|---|---|---|---|
| Sidebar | capability | PASS/FAIL | PASS/FAIL | PASS/FAIL | YC/Apple | `<why>` | PASS/FAIL |
| Page layout | capability | PASS/FAIL | PASS/FAIL | PASS/FAIL | YC/Apple | `<why>` | PASS/FAIL |
| Agents | capability | PASS/FAIL | PASS/FAIL | PASS/FAIL | YC/Apple | `<why>` | PASS/FAIL |
| Chat | capability | PASS/FAIL | PASS/FAIL | PASS/FAIL | YC/Apple | `<why>` | PASS/FAIL |
| Admin panel settings | capability | PASS/FAIL | PASS/FAIL | PASS/FAIL | YC/Apple | `<why>` | PASS/FAIL |

## Partnership Data Presence Snapshot

Informational only during FUSE-200.
State gate is enforced in FUSE-201 bootstrap verification.

| Object | YC count | Apple count | Production count | Notes |
|---|---|---|---|---|
| partnerProfile |  |  |  |  |
| partnerTrack |  |  |  |  |
| trackCheck |  |  |  |  |
| trackEnrichment |  |  |  |  |
| trackExclusion |  |  |  |  |
| discoveryRun |  |  |  |  |
| partnerCandidate |  |  |  |  |
| partnerAttributionEvent |  |  |  |  |

## Evidence Links

### YC (`yc.localhost`)

1. `<screenshot/file/path>`
2. `<screenshot/file/path>`

### Apple (`apple.localhost`)

1. `<screenshot/file/path>`
2. `<screenshot/file/path>`

### Production (`app.fusegtm.com`)

1. `<screenshot/file/path>`
2. `<screenshot/file/path>`

## Regression Gate

- [ ] Google auth flow still works.
- [ ] Deploy + health checks still pass.
- [ ] Multi-workspace routing still works.
- [ ] Admin panel low-risk write-and-revert check passes in production.

## Go/No-Go Decision

- Decision: `GO` or `NO-GO`
- Rationale: `<one paragraph>`
- Next action:
  - If GO: proceed to FUSE-201.
  - If NO-GO: list exact gaps by slice.
