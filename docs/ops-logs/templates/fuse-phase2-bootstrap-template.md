# FUSE-201 Bootstrap Log

- Timestamp (UTC): `<yyyy-mm-ddThh:mm:ssZ>`
- Operator: `<name>`
- Environment: `production`
- Workspace ID: `<uuid>`

## Pre-window Checks

- [ ] `curl -fsS https://app.fusegtm.com/healthz` PASS
- [ ] Local host health check PASS (`curl -fsS http://localhost:3000/healthz` on EC2)
- [ ] No unresolved Sev-1 incidents
- Precheck command used:
  - `bash packages/twenty-docker/scripts/fuse-phase2-precheck.sh --ack-no-sev1`

## Command Execution

### Bootstrap run #1

- Command:

```bash
docker compose \
  -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  -f packages/twenty-docker/docker-compose.aws.yml \
  --env-file packages/twenty-docker/.env \
  exec -T server \
  yarn command:prod workspace:bootstrap:partner-os -w <workspace-id>
```

- Result summary: `<short output summary>`

### Bootstrap run #2 (idempotency)

- Same command rerun: `YES`
- Result summary: `<short output summary>`
- Idempotency verdict: `PASS/FAIL`

## Canonical Object Inventory (16)

| Object | Present | Navigable | Notes |
|---|---|---|---|
| lead | YES/NO | YES/NO |  |
| partnerProfile | YES/NO | YES/NO |  |
| partnerContactAssignment | YES/NO | YES/NO |  |
| partnerCustomerMap | YES/NO | YES/NO |  |
| partnerAttributionEvent | YES/NO | YES/NO |  |
| partnerAttributionSnapshot | YES/NO | YES/NO |  |
| customerEvent | YES/NO | YES/NO |  |
| customerSnapshot | YES/NO | YES/NO |  |
| partnerPlay | YES/NO | YES/NO |  |
| playCheck | YES/NO | YES/NO |  |
| playEnrichment | YES/NO | YES/NO |  |
| playExclusion | YES/NO | YES/NO |  |
| discoveryRun | YES/NO | YES/NO |  |
| partnerCandidate | YES/NO | YES/NO |  |
| checkEvaluation | YES/NO | YES/NO |  |
| enrichmentEvaluation | YES/NO | YES/NO |  |

## Auto-created View Check

- [ ] Kanban views present where expected.
- [ ] Calendar views present where expected.
- Notes: `<details>`

## Post-window Checks

- [ ] Public health PASS
- [ ] Local health PASS
- [ ] Auth and routing sanity PASS

## Decision

- FUSE-201 status: `DONE/BLOCKED`
- If BLOCKED, blocker + owner + next action:
  - `<details>`
