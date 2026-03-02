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
   - `IS_CONFIG_VARIABLES_IN_DB_ENABLED=true`
   - `TELEMETRY_ENABLED=false`
   - `ANALYTICS_ENABLED=false`

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
        ask http://127.0.0.1:3000/healthz
    }
}

*.fusegtm.com {
    tls {
        on_demand
    }
    reverse_proxy 127.0.0.1:3000
}
```

Caddy runs as a systemd service and issues/renews certs on first request per subdomain.

## Runtime watchdog

Use the watchdog to recover from local server failures:

```bash
ENV_FILE=packages/twenty-docker/.env \
VERIFY_PUBLIC_INGRESS=true \
bash packages/twenty-docker/scripts/check-runtime-and-ingress.sh
```

## Local troubleshooting

Check app health:

```bash
curl -fsS http://localhost:3000/healthz
```

Check public health:

```bash
curl -fsS https://app.fusegtm.com/healthz
```

If local is healthy but public fails, check Caddy: `sudo systemctl status caddy`.
