# Fuse Phase 1 Soak Log (7 Days)

Start this only after FUSE-105 is DONE.

Pass condition: **0 Sev-1 incidents for 7 consecutive days**.

## Daily Checks

1. Public health: `curl -fsS https://app.fusegtm.com/healthz`
2. Local health: `curl -fsS http://localhost:3000/healthz`
3. Auth: Google login with fresh browser session.
4. Core operation: create one record and update one record.
5. Worker operation: trigger one background job and verify completion.
6. Backup sanity: confirm latest backup exists; perform one restore rehearsal during the 7-day window.

## Log Table

| Day | Date (UTC) | Public Health | Local Health | Google OAuth | Create/Update | Worker Job | Backup Check | Sev-1 Count | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |  |  |
| 6 |  |  |  |  |  |  |  |  |  |
| 7 |  |  |  |  |  |  |  |  |  |

## Closeout

If all 7 days are clean:

1. Mark Phase 1 "Public URL stable for 7 days" as done.
2. Mark Day 7 checklist done in execution tracker.
3. Attach this completed log in Closed for acceptance evidence.
