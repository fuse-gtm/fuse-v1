# FUSE-204 Seed Log

- Timestamp (UTC): `<yyyy-mm-ddThh:mm:ssZ>`
- Operator: `<name>`
- Workspace: `<name/id>`

## Seeding Method

- Source baseline used: `YC / Apple / Hybrid`
- Method: `Manual UI / Scripted`
- Naming prefix used for demo data: `DEMO_`

## Seed Target Validation

| Object | Required minimum | Actual | Status | Notes |
|---|---|---|---|---|
| partnerProfile | 4 |  | PASS/FAIL |  |
| partnerContactAssignment | 6 |  | PASS/FAIL |  |
| partnerCustomerMap | 4 |  | PASS/FAIL |  |
| partnerPlay | 2 |  | PASS/FAIL |  |
| playCheck | 8 |  | PASS/FAIL |  |
| playEnrichment | 4 |  | PASS/FAIL |  |
| playExclusion | 2 |  | PASS/FAIL |  |
| discoveryRun | 1 completed |  | PASS/FAIL |  |
| partnerCandidate | 8 |  | PASS/FAIL |  |
| checkEvaluation | linked |  | PASS/FAIL |  |
| enrichmentEvaluation | linked |  | PASS/FAIL |  |
| partnerAttributionEvent | 6 |  | PASS/FAIL |  |

## Relationship Integrity

- [ ] No orphan relations found.
- [ ] Candidate -> evaluations links valid.
- [ ] Partner map -> partner profile links valid.
- [ ] Discovery run -> candidates links valid.

## Demo Storylines Enabled

| Storyline | Record set | Runnable end-to-end | Notes |
|---|---|---|---|
|  |  | YES/NO |  |
|  |  | YES/NO |  |

## Gaps

List any missing data needed for Phase 3 workflows.

## Decision

- FUSE-204 status: `DONE/BLOCKED`
- Notes: `<short summary>`
