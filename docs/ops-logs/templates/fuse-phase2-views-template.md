# FUSE-203 Views Configuration Log

- Timestamp (UTC): `<yyyy-mm-ddThh:mm:ssZ>`
- Operator: `<name>`
- Workspace: `<name/id>`

## Pre-window Checks

- [ ] Public health PASS
- [ ] Local health PASS
- [ ] No unresolved Sev-1

## Views Applied

| Object | View name | Type | Filters | Sort | Shared to workspace | Status |
|---|---|---|---|---|---|---|
| partnerProfile | Active Partners | Table | status=ACTIVE | lifecycleStage asc/desc | YES/NO | PASS/FAIL |
| partnerCustomerMap | Active Handoffs | Table | stage not in CLOSED_WON,CLOSED_LOST | updatedAt desc | YES/NO | PASS/FAIL |
| partnerTrack | Templates | Table | isTemplate=true | updatedAt desc | YES/NO | PASS/FAIL |
| partnerTrack | Live Tracks | Table | isTemplate=false | updatedAt desc | YES/NO | PASS/FAIL |
| discoveryRun | In Flight | Table | status in PENDING,STREAMING | startedAt desc | YES/NO | PASS/FAIL |
| discoveryRun | Completed | Table | status=COMPLETE | startedAt desc | YES/NO | PASS/FAIL |
| partnerCandidate | Qualified | Table | gateStatus=QUALIFIED | fitScore desc | YES/NO | PASS/FAIL |
| partnerCandidate | Disqualified | Table | gateStatus=DISQUALIFIED | updatedAt desc | YES/NO | PASS/FAIL |
| partnerAttributionEvent | Recent Events | Table | none | occurredAt desc | YES/NO | PASS/FAIL |

## Evidence

1. `<screenshot path>`
2. `<screenshot path>`
3. `<screenshot path>`

## Post-window Checks

- [ ] Public health PASS
- [ ] Local health PASS
- [ ] Google auth sanity PASS
- [ ] Multi-workspace routing sanity PASS

## Decision

- FUSE-203 status: `DONE/BLOCKED`
- Notes: `<short summary>`
