# Fuse Runtime Outage Remediation

- Timestamp (UTC):
- Operator:
- Environment:
- Image tag:

## Incident Summary

- Trigger:
- User impact window:
- Public health before fix:
- Local health before fix:

## Diagnosis

- `docker compose ... ps`:
- `docker top twenty-server-1`:
- Server log signal:
- Caddy log signal:
- Redis/RDS signal (if relevant):

## Remediation Steps

1.
2.
3.

## Configuration Changes

- `DISABLE_CRON_JOBS_REGISTRATION`:
- `CRON_REGISTRATION_TIMEOUT_SECONDS`:
- `CRON_REGISTER_COMMAND_TIMEOUT_MS`:
- `REGISTER_CRONS_POST_DEPLOY`:

## Validation

- `curl -fsS http://localhost:3000/healthz`:
- `curl -fsS https://app.fusegtm.com/healthz`:
- OAuth smoke test:
- Multi-workspace routing smoke test:

## Follow-ups

1.
2.

