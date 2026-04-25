# Fuse on Twenty: Deployment Contract

This folder is the runtime contract for Fuse on top of Twenty.

## Required deployment model

1. Run pinned images from GHCR (`TWENTY_IMAGE=ghcr.io/fuse-gtm/fuse-v1:partner-os-<sha>`).
2. Run on an always-on host (current: AWS EC2 t3.small, Ubuntu 22.04).
3. Use **Caddy** for HTTPS termination and reverse proxy for `*.fusegtm.com` with on-demand TLS.
4. Use **AWS RDS PostgreSQL** as the database (external to the Docker stack).
5. Keep runtime flags explicit:
   - `IS_MULTIWORKSPACE_ENABLED=true`
   - `IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS=true`
   - `IS_CONFIG_VARIABLES_IN_DB_ENABLED=false`
   - `TELEMETRY_ENABLED=false`
   - `ANALYTICS_ENABLED=false`
   - `AI_TELEMETRY_ENABLED=false`
   - `ALLOW_REQUESTS_TO_TWENTY_ICONS=false`
   - `COMPANY_ENRICHMENT_ENABLED=false`
   - `MARKETPLACE_REMOTE_FETCH_ENABLED=false`
   - `ADMIN_VERSION_CHECK_ENABLED=false`
   - `HELP_CENTER_SEARCH_ENABLED=false`
   - `SUPPORT_DRIVER=NONE`

## Environment file

Start from:

`packages/twenty-docker/.env.fuse-prod.example`

Create your host-local env:

```bash
cp packages/twenty-docker/.env.fuse-prod.example packages/twenty-docker/.env
```

Fill required values:

1. `TWENTY_IMAGE`
2. `SERVER_URL`
3. `PUBLIC_BASE_URL`
4. `APP_SECRET`
5. `PG_DATABASE_PASSWORD`

If GHCR package is private, set:

1. `GHCR_USERNAME`
2. `GHCR_TOKEN` (must include `read:packages`)

## Deploy

Run production deploy with preflight + local/public health checks:

```bash
ENV_FILE=packages/twenty-docker/.env \
EXTRA_COMPOSE_FILE=packages/twenty-docker/docker-compose.aws.yml \
VERIFY_PUBLIC_URL=true \
bash packages/twenty-docker/scripts/deploy-fuse-prod.sh
```

Deploy a specific immutable tag (and use the same command for rollback):

```bash
ENV_FILE=packages/twenty-docker/.env \
EXTRA_COMPOSE_FILE=packages/twenty-docker/docker-compose.aws.yml \
VERIFY_PUBLIC_URL=true \
bash packages/twenty-docker/scripts/deploy-fuse-prod.sh partner-os-<sha>
```

Note: `EXTRA_COMPOSE_FILE` is **required** when `PG_DATABASE_HOST` points to an external database (e.g. RDS). The deploy script will refuse to start without it.

Runtime safety defaults (recommended on t3.small):

1. `DISABLE_CRON_JOBS_REGISTRATION=true` (skip startup-time cron registration)
2. `REGISTER_CRONS_POST_DEPLOY=true` (run one-shot cron registration after health checks)
3. `CRON_REGISTRATION_TIMEOUT_SECONDS=60`
4. `CRON_REGISTER_COMMAND_TIMEOUT_MS=5000`
5. `SERVER_NODE_MAX_OLD_SPACE_MB=1024`
6. `WORKER_NODE_MAX_OLD_SPACE_MB=768`

## OAuth readiness check

Before enabling OAuth in production, validate the env file:

```bash
ENV_FILE=packages/twenty-docker/.env \
EXPECTED_BASE_URL=https://app.fusegtm.com \
CHECK_PROVIDERS=google \
bash packages/twenty-docker/scripts/fuse-oauth-readiness-check.sh
```

## Deploy/rollback drill

Run a full A -> B -> A drill with timing evidence:

```bash
bash packages/twenty-docker/scripts/fuse-deploy-rollback-drill.sh \
  --tag-a partner-os-<tag-a> \
  --tag-b partner-os-<tag-b>
```

This writes a markdown log under `docs/ops-logs/`.

## Tenant post-activation bootstrap

Run the Fuse baseline bootstrap for a newly activated workspace (includes a second run for idempotency proof):

```bash
WORKSPACE_ID=<workspace-id> \
ENV_FILE=packages/twenty-docker/.env \
EXTRA_COMPOSE_FILE=packages/twenty-docker/docker-compose.aws.yml \
bash packages/twenty-docker/scripts/fuse-tenant-bootstrap.sh
```

## Workspace creation aging report

Generate a report of workspaces stuck in `PENDING_CREATION` or `ONGOING_CREATION` beyond a threshold:

```bash
THRESHOLD_HOURS=24 \
ENV_FILE=packages/twenty-docker/.env \
bash packages/twenty-docker/scripts/fuse-workspace-creation-report.sh
```

## Runtime restart drill

Run a 3-cycle restart recovery drill and capture evidence:

```bash
ENV_FILE=packages/twenty-docker/.env \
EXTRA_COMPOSE_FILE=packages/twenty-docker/docker-compose.aws.yml \
VERIFY_PUBLIC=true \
bash packages/twenty-docker/scripts/fuse-runtime-restart-drill.sh
```

## AWS infrastructure

Current production stack:

- **EC2**: `i-05b90467e22fec9d2` at `52.20.136.71` (t3.small, Ubuntu 22.04)
- **RDS**: PostgreSQL 15.12 at `fuse-prod-db.cgnqkm0s4v6f.us-east-1.rds.amazonaws.com`
- **Caddy**: On-demand Let's Encrypt certs for `*.fusegtm.com` (including `app.fusegtm.com`)
- **DNS**: Wildcard and app records point to EC2 (`*.fusegtm.com` and `app.fusegtm.com` → `52.20.136.71`, Hostinger)
- **SSH**: `ssh -i ~/.ssh/fuse-prod.pem ubuntu@52.20.136.71`

RDS CA bundle is mounted from `/opt/fuse/certs/rds-combined-ca-bundle.pem` into containers via `docker-compose.aws.yml`.

## Caddy configuration

Caddyfile location: `/etc/caddy/Caddyfile`

```
{
    on_demand_tls {
        ask http://127.0.0.1:9080/allow
    }
}

*.fusegtm.com {
    tls {
        on_demand
    }
    reverse_proxy 127.0.0.1:3000
}
```

Caddy runs as a systemd service and issues/renews certs on first request per subdomain. The `ask` endpoint is handled by `fuse-caddy-ask`, a Python service that validates whether a domain should receive a certificate (see below).

## TLS allowlist service

The `fuse-caddy-ask` service gates on-demand TLS certificate issuance. It allows certs for `app.fusegtm.com` and valid workspace subdomains (`{label}.fusegtm.com`), and blocks reserved labels (www, mail, api, admin, etc.) and invalid patterns.

Install as a systemd service:

```bash
sudo bash packages/twenty-docker/scripts/install-caddy-ask-service.sh
```

After installing, update the Caddyfile `ask` URL to `http://127.0.0.1:9080/allow` and reload Caddy.

## Runtime watchdog

Monitors local server health and public ingress (via Caddy). Restarts the server container on local failure, Caddy on public failure.

```bash
ENV_FILE=packages/twenty-docker/.env \
VERIFY_PUBLIC_INGRESS=true \
bash packages/twenty-docker/scripts/check-runtime-and-ingress.sh
```

Cron (every 5 min):

```bash
*/5 * * * * ENV_FILE=/opt/fuse/packages/twenty-docker/.env VERIFY_PUBLIC_INGRESS=true /opt/fuse/packages/twenty-docker/scripts/check-runtime-and-ingress.sh >> /var/log/fuse-watchdog.log 2>&1
```

Install both watchdog + health metric cron jobs idempotently:

```bash
ENV_FILE=/opt/fuse/packages/twenty-docker/.env \
EXTRA_COMPOSE_FILE=/opt/fuse/packages/twenty-docker/docker-compose.aws.yml \
bash packages/twenty-docker/scripts/fuse-install-runtime-guardrails.sh
```

## Alerting

Set up CloudWatch alarms and SNS email alerts:

```bash
ALERT_EMAIL=dhruv@fusegtm.com \
EC2_INSTANCE_ID=i-05b90467e22fec9d2 \
RDS_INSTANCE_ID=fuse-prod-db \
bash packages/twenty-docker/scripts/fuse-setup-alerting.sh
```

Health metric publisher (cron, every 1 min):

```bash
* * * * * /opt/fuse/packages/twenty-docker/scripts/fuse-publish-health-metric.sh >> /var/log/fuse-health-metric.log 2>&1
```

External synthetic checks (outside EC2) for `/readyz` and `/`:

```bash
APP_HOST=app.fusegtm.com \
ALERT_TOPIC_ARN=<sns-topic-arn> \
bash packages/twenty-docker/scripts/fuse-setup-external-health-check.sh
```

## Backup restore drill

Verify RDS point-in-time restore works end-to-end:

```bash
SOURCE_DB_INSTANCE=fuse-prod-db \
DB_PASSWORD=<password> \
bash packages/twenty-docker/scripts/fuse-backup-restore-drill.sh
```

Writes evidence to `docs/ops-logs/`.

## Incident runbook

See `docs/fuse-deploy-incident-runbook.md` for triage, rollback, and escalation procedures.
Start with infrastructure reachability first: check EC2 `StatusCheckFailed` alarm and instance status checks before debugging app code.

## Local troubleshooting

Check app readiness:

```bash
curl -fsS http://localhost:3000/readyz
```

Check public readiness:

```bash
curl -fsS https://app.fusegtm.com/readyz
```

If local is healthy but public fails, check Caddy: `sudo systemctl status caddy`.
