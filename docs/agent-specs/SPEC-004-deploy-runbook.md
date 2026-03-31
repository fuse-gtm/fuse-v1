# SPEC-004: Deploy Runbook

## Context

Fuse runs on a single EC2 t3.small instance (`i-05b90467e22fec9d2`) in
`us-east-1`. The stack is Docker Compose (server + worker + Redis + Caddy)
behind an EIP (`52.20.136.71`) with DNS at `app.fusegtm.com`.

This runbook is agent-executable. Every step has a concrete command and an
expected output. No ambiguity.

## Prerequisites

- SSH access to the EC2 host
- Docker + Docker Compose installed on host
- GHCR credentials with `read:packages` scope (for private image pulls)
- `.env` file at `packages/twenty-docker/.env` (copy from `.env.fuse-prod.example`)
- Production workspace ID: `06e070b2-80eb-4097-8813-8d2ebe632108`

## Infrastructure

| Component | Value |
|-----------|-------|
| EC2 instance | `i-05b90467e22fec9d2` |
| Instance type | `t3.small` (2 vCPU, 2GB RAM) |
| Region | `us-east-1` |
| EIP | `52.20.136.71` (`eipalloc-047bb773550ddc232`) |
| DNS | `app.fusegtm.com` -> EIP |
| Reverse proxy | Caddy (systemd service) |
| Image registry | `ghcr.io/fuse-gtm/fuse-v1` |
| Image tag format | `partner-os-<short-sha>` (immutable) |
| Branch | `feat/partner-os-schema-spine` |

## Step 1: Build and Push Image

Run from a machine with Docker buildx and GHCR write access.

```bash
# From repo root
IMAGE_TAG=partner-os-$(git rev-parse --short HEAD) \
bash packages/twenty-docker/scripts/build-push-fuse-image.sh
```

**Expected:** Image pushed to `ghcr.io/fuse-gtm/fuse-v1:partner-os-<sha>`.

**Verify:**
```bash
docker manifest inspect ghcr.io/fuse-gtm/fuse-v1:partner-os-$(git rev-parse --short HEAD)
```

## Step 2: Pre-Deploy Checks

### 2a: Sovereignty Preflight

The preflight script enforces that all telemetry/surveillance flags are disabled.
It will hard-fail if any of these are wrong:

```bash
MODE=prod \
ENV_FILE=packages/twenty-docker/.env \
IMAGE_REF=ghcr.io/fuse-gtm/fuse-v1:partner-os-<sha> \
bash packages/twenty-docker/scripts/fuse-deploy-preflight.sh
```

**Expected output:** `Preflight passed (mode=prod)`

**What it checks:**
- Docker daemon reachable
- Docker Compose and buildx plugins present
- GHCR auth valid (for ghcr.io images)
- Image exists in registry
- Host memory above `MIN_FREE_MEM_MB` (512MB default)
- Strict sovereignty mode (all of the following must be exactly as shown):

| Variable | Required Value |
|----------|---------------|
| `IS_CONFIG_VARIABLES_IN_DB_ENABLED` | `false` |
| `TELEMETRY_ENABLED` | `false` |
| `ANALYTICS_ENABLED` | `false` |
| `AI_TELEMETRY_ENABLED` | `false` |
| `ALLOW_REQUESTS_TO_TWENTY_ICONS` | `false` |
| `COMPANY_ENRICHMENT_ENABLED` | `false` |
| `COMPANY_ENRICHMENT_PROVIDER` | `none` |
| `MARKETPLACE_REMOTE_FETCH_ENABLED` | `false` |
| `ADMIN_VERSION_CHECK_ENABLED` | `false` |
| `HELP_CENTER_SEARCH_ENABLED` | `false` |
| `HELP_CENTER_SEARCH_PROVIDER` | `none` |
| `SUPPORT_DRIVER` | `none` |

**Note on COMPANY_ENRICHMENT_ENABLED:** The preflight enforces `false` in
strict sovereignty mode because enrichment calls Twenty's servers. To enable
the built-in Twenty enrichment provider, temporarily set
`STRICT_SOVEREIGNTY_MODE=false` or update the preflight to allowlist the
`twenty` provider. See SPEC-002 for the recommended change.

### 2b: Env File Audit

Manually verify these critical values in `packages/twenty-docker/.env`:

```bash
grep -E '^(SERVER_URL|APP_SECRET|PG_DATABASE_|TWENTY_IMAGE|IS_MULTIWORKSPACE|VERIFY_PUBLIC_URL)' \
  packages/twenty-docker/.env
```

**Expected:**
- `SERVER_URL=https://app.fusegtm.com`
- `APP_SECRET=<non-empty, non-default>`
- `PG_DATABASE_PASSWORD=<non-empty, non-default>`
- `TWENTY_IMAGE=ghcr.io/fuse-gtm/fuse-v1:partner-os-<sha>`
- `IS_MULTIWORKSPACE_ENABLED=true`
- `VERIFY_PUBLIC_URL=true`

### 2c: Feature Flag Check (Pre-Deploy)

Before deploying, verify flags exist for the production workspace.
Connect to the database and run:

```sql
SELECT "key", "value"
FROM core."featureFlag"
WHERE "workspaceId" = '06e070b2-80eb-4097-8813-8d2ebe632108'
ORDER BY "key";
```

**Expected:** 23 rows. See SPEC-002 for the complete flag list. Critical flag:
`IS_PARTNER_OS_ENABLED` must be `true`.

If flags are missing, run the backfill SQL from SPEC-002 Step 2 before deploying.

## Step 3: Deploy

```bash
# From repo root on the EC2 host
bash packages/twenty-docker/scripts/deploy-fuse-prod.sh partner-os-<sha>
```

**What this does (in order):**
1. Sources `.env` file
2. Overrides image tag if provided as argument
3. Authenticates to GHCR (if credentials in env)
4. Runs preflight (Step 2a above)
5. Guards against external DB without `EXTRA_COMPOSE_FILE`
6. `docker compose up -d` with compose files:
   - `docker-compose.yml`
   - `docker-compose.fuse.yml`
   - `$EXTRA_COMPOSE_FILE` (if set)
7. Polls `http://localhost:3000/healthz` (max 180s)
8. Polls public health URL (max 180s, if `VERIFY_PUBLIC_URL=true`)
9. Registers cron jobs post-deploy (if `REGISTER_CRONS_POST_DEPLOY=true`)
10. Bootstraps Partner OS for `$WORKSPACE_ID` (if set)

**Expected output sequence:**
```
Preflight passed (mode=prod)
Deploying ghcr.io/fuse-gtm/fuse-v1:partner-os-<sha>
Waiting for health: http://localhost:3000/healthz
Server healthy
Waiting for public health: https://app.fusegtm.com/healthz
Public health check passed
Registering cron jobs post-deploy (timeout=90s)
Post-deploy cron registration succeeded
```

## Step 4: Post-Deploy Verification

### 4a: Health Checks

```bash
# Local
curl -fsS http://localhost:3000/healthz

# Public
curl -fsS https://app.fusegtm.com/healthz

# Auth flow
curl -sI https://app.fusegtm.com/auth/google | head -5
```

**Expected:** `200` on healthz endpoints. Auth endpoint returns redirect or method-not-allowed.

### 4b: Container Status

```bash
docker compose \
  -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  --env-file packages/twenty-docker/.env \
  ps
```

**Expected:** `server`, `worker`, `redis` all in `Up` state. No restart loops.

### 4c: Partner OS Bootstrap Verification

If `WORKSPACE_ID` was set during deploy, verify custom objects exist:

```sql
SELECT "nameSingular", "isActive"
FROM metadata."objectMetadata"
WHERE "workspaceId" = '06e070b2-80eb-4097-8813-8d2ebe632108'
  AND "nameSingular" IN (
    'partnerProfile', 'partnerTrack', 'trackCheck', 'trackEnrichment',
    'trackExclusion', 'discoveryRun', 'partnerCandidate', 'checkEvaluation',
    'enrichmentEvaluation', 'partnerCustomerMap', 'partnerContactAssignment',
    'lead', 'partnerAttributionEvent', 'partnerAttributionSnapshot',
    'customerEvent', 'customerSnapshot'
  )
ORDER BY "nameSingular";
```

**Expected:** 16 rows, all `isActive = true`.

### 4d: Runtime Watchdog

Set up the cron watchdog (if not already):

```bash
# Add to crontab on the EC2 host
# */5 * * * * ENV_FILE=/opt/fuse/packages/twenty-docker/.env \
#   VERIFY_PUBLIC_INGRESS=true \
#   /opt/fuse/packages/twenty-docker/scripts/check-runtime-and-ingress.sh \
#   >> /var/log/fuse-watchdog.log 2>&1
```

## Step 5: Rollback

If the deploy fails or the app is unhealthy after deployment:

### 5a: Quick Rollback (Previous Image Tag)

```bash
# Find the previous working tag
docker images ghcr.io/fuse-gtm/fuse-v1 --format '{{.Tag}}' | head -5

# Redeploy with the previous tag
bash packages/twenty-docker/scripts/deploy-fuse-prod.sh partner-os-<previous-sha>
```

### 5b: Container-Level Recovery

```bash
# Restart just the server
docker compose \
  -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  --env-file packages/twenty-docker/.env \
  restart server

# Check logs if restart doesn't help
docker compose \
  -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  --env-file packages/twenty-docker/.env \
  logs server --tail 200
```

### 5c: Host-Level Recovery (Sev-1)

If the EC2 instance itself is unreachable (see incident log
`docs/ops-logs/2026-03-04-app-fusegtm-reachability-incident.md`):

```bash
# Reboot the instance
aws ec2 reboot-instances \
  --instance-ids i-05b90467e22fec9d2 \
  --region us-east-1

# Poll until status checks pass
aws ec2 describe-instance-status \
  --instance-ids i-05b90467e22fec9d2 \
  --region us-east-1 \
  --query 'InstanceStatuses[0].{System:SystemStatus.Status,Instance:InstanceStatus.Status}'
```

**Expected after reboot:** `{ "System": "ok", "Instance": "ok" }`

Then verify EIP is still attached:
```bash
aws ec2 describe-addresses \
  --allocation-ids eipalloc-047bb773550ddc232 \
  --region us-east-1 \
  --query 'Addresses[0].InstanceId'
```

**Expected:** `i-05b90467e22fec9d2`

## Rollback Triggers

Initiate rollback if ANY of these occur within 15 minutes of deploy:

- `/healthz` returns non-200 after the health wait period
- Public URL times out
- Container enters restart loop (check with `docker ps --format '{{.Status}}'`)
- Server logs show `FATAL` or `UnhandledPromiseRejection`
- Feature flag query returns fewer than 23 rows
- Partner OS bootstrap reports missing objects

## Deploy Freeze Rules

Do NOT deploy if:
- EC2 status checks are not both `ok`
- Previous deploy had an unresolved rollback
- Feature flag backfill (SPEC-002) has not been verified
- `.env` has any `replace_with_*` placeholder values
- `VERIFY_PUBLIC_URL=false` without `ALLOW_DEPLOY_WITHOUT_PUBLIC_HEALTHCHECK=true`

## Acceptance Criteria

- [ ] Image built and pushed with immutable tag
- [ ] Preflight passes with strict sovereignty mode
- [ ] All containers running, no restart loops
- [ ] Local and public health checks pass
- [ ] Feature flags verified (23 rows, IS_PARTNER_OS_ENABLED=true)
- [ ] Partner OS objects verified (16 rows, all active)
- [ ] Watchdog cron installed
- [ ] No telemetry/analytics flags accidentally enabled

## Guard Rails

- Image tags are immutable (`partner-os-<sha>`). Never reuse a tag.
- The deploy script enforces public health verification by default. Do not
  disable without a documented incident.
- Strict sovereignty mode blocks any deploy where telemetry flags are enabled.
- The `t3.small` has only 2GB RAM. Watch for OOM during container restarts.
  The `.env` template sets `SERVER_NODE_MAX_OLD_SPACE_MB=1024` and
  `WORKER_NODE_MAX_OLD_SPACE_MB=768`.
- OAuth callback URLs must match `SERVER_URL` exactly. A mismatch causes
  silent auth failures.
- Never run `docker compose down` without `--volumes` awareness. Dropping
  volumes on local DB setups destroys data.
