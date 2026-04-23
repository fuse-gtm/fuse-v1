# Wave 2 + Wave 2.5 — Final Deploy Commands (Paste-ready)

**Goal:** one founder, one terminal, one deploy. Copy blocks top-to-bottom.

**Assumes:** Fuse prod EC2 is `52.20.136.71`, workspace ID `06e070b2-80eb-4097-8813-8d2ebe632108`, you can SSH as `ec2-user`, GHCR token in your local env as `GHCR_TOKEN`, Docker + buildx installed locally.

**Reference docs (already on main):**
- `docs/ops-logs/2026-04-23-wave2-deploy-readiness.md` — full pre-flight, rollback, validation
- `docs/ops-logs/2026-04-23-wave2-followup-index.md` — everything else open
- `docs/agent-specs/SPEC-004-deploy-runbook.md` — canonical runbook

---

## Phase 0 — Regenerate yarn.lock on any dev machine with network access

The wave 2D + wave 2.5 cherry-picks left the lockfile out of sync. Do this FIRST from a machine that has outbound internet (not the sandboxed CI environment):

```bash
# Clone/update fresh
git clone git@github.com:fuse-gtm/fuse-v1.git fuse-deploy-prep  # or cd into existing clone
cd fuse-deploy-prep
git fetch origin
git checkout main
git pull origin main

# Regenerate the lockfile
# Node 24.5.0 per .nvmrc — switch via nvm if needed
nvm use 24.5.0 2>/dev/null || echo "ensure Node 24.5.0 is active"
yarn install

# Commit + push
git add yarn.lock
git diff --stat HEAD~1 HEAD yarn.lock  # sanity-check the diff
git commit -m "chore: regenerate yarn.lock post wave 2D + wave 2.5"
git push origin main
```

**Verify CI green before proceeding:**

```bash
gh run list --repo fuse-gtm/fuse-v1 --branch main --limit 3
# Wait for server-build / server-lint-typecheck / ui-task / sdk-test to all show "completed success"
```

If CI fails on something other than yarn.lock, stop and inspect. See `docs/ops-logs/2026-04-23-wave2-followup-index.md` P0/P1 items.

## Phase 1 — Build + push prod image

From the same dev machine:

```bash
cd fuse-deploy-prep
export IMAGE_TAG=partner-os-$(git rev-parse --short HEAD)
echo "Building: $IMAGE_TAG"

# Login to GHCR (one-time)
echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin

# Build multi-tag, AMD64 for EC2 t3.small
docker buildx build \
  --platform linux/amd64 \
  -f packages/twenty-docker/twenty/Dockerfile \
  -t "ghcr.io/fuse-gtm/fuse-v1:$IMAGE_TAG" \
  -t "ghcr.io/fuse-gtm/fuse-v1:partner-os-latest" \
  --push \
  .
```

## Phase 2 — SSH, set TRUST_PROXY, deploy, migrate, smoke

Single SSH session doing the whole deploy:

```bash
ssh ec2-user@52.20.136.71 << 'REMOTE'
set -euo pipefail

cd ~/fuse-v1/packages/twenty-docker  # adjust path if your repo clone is elsewhere

# Pre-deploy: ensure TRUST_PROXY=1 is set (wave 2A requirement)
if ! grep -q "^TRUST_PROXY=" .env; then
  echo "TRUST_PROXY=1" >> .env
  echo "Added TRUST_PROXY=1 to .env"
else
  echo "TRUST_PROXY already present: $(grep ^TRUST_PROXY .env)"
fi

# Pull latest image
docker compose pull

# Roll
docker compose up -d

# Wait for health
sleep 15
docker compose ps

# Run any pending migrations (TypeORM applies idempotent)
docker compose exec -T twenty-server npx nx run twenty-server:database:migrate:prod

# Clean up stale feature-flag rows removed in wave 2D
docker compose exec -T twenty-postgres psql -U "${PG_USER:-postgres}" -d "${PG_DB:-default}" <<SQL
SELECT "key", COUNT(*) AS orphan_count FROM core."featureFlag"
WHERE "key" IN ('IS_DRAFT_EMAIL_ENABLED', 'IS_USAGE_ANALYTICS_ENABLED',
                'IS_RECORD_TABLE_WIDGET_ENABLED', 'IS_AI_ENABLED')
GROUP BY "key";

DELETE FROM core."featureFlag"
WHERE "key" IN ('IS_DRAFT_EMAIL_ENABLED', 'IS_USAGE_ANALYTICS_ENABLED',
                'IS_RECORD_TABLE_WIDGET_ENABLED', 'IS_AI_ENABLED');
SQL

# Smoke: tail logs for 30s
timeout 30 docker compose logs -f --tail=50 twenty-server || true

echo "Deploy complete. Verifying externally..."
REMOTE

# External smoke from your dev machine
curl -sS https://app.fusegtm.com/healthz && echo " [healthz OK]"
curl -sS https://app.fusegtm.com/api/version

# Manual sign-in verification — open in browser
echo "Open https://app.fusegtm.com and sign in. Verify:"
echo "  - no 'workspace suspended' banner"
echo "  - partner-os dashboard loads"
echo "  - admin → settings → roles page renders (wave 2D RBAC)"
echo "  - admin → settings → enterprise page doesn't hang (TRUST_PROXY effective)"
```

## Phase 3 — 60-minute soak

Leave prod alone for 60 minutes. Check for:
- 5xx errors in logs: `ssh ec2-user@52.20.136.71 docker compose logs --since=60m twenty-server | grep -E '5[0-9]{2}'`
- Unexpected twenty.com egress: `ssh ec2-user@52.20.136.71 docker compose logs --since=60m twenty-server | grep "twenty.com" | grep -vE "enterprise/(status|portal|checkout)"` — any match = NEW phone-home introduced (shouldn't happen, but verify)
- Memory stable: `ssh ec2-user@52.20.136.71 docker stats --no-stream twenty-server` — RSS should stay under 70% of t3.small's 2GB.

## Phase 4 — Apollo activation (optional, when ready)

Follow `docs/superpowers/plans/2026-04-24-apollo-activation.md` end-to-end. Highlights:
- Set `COMPANY_ENRICHMENT_ENABLED=true` + `COMPANY_ENRICHMENT_PROVIDER=twenty` in `.env`
- Install the Apollo app via admin UI or GraphQL mutation
- Configure OAuth credentials in Apollo.io portal + paste into Fuse admin UI
- Smoke-test enrichment on a Company record

---

## Rollback (if Phase 2 or 3 surfaces breakage)

```bash
ssh ec2-user@52.20.136.71 << 'REMOTE'
cd ~/fuse-v1/packages/twenty-docker
# Find previous image tag from compose history or local cache
docker compose down
# Edit .env to point TWENTY_IMAGE at prev tag
# Or use an explicit IMAGE_TAG override:
# TWENTY_IMAGE=ghcr.io/fuse-gtm/fuse-v1:partner-os-<PREV-SHORT-SHA> docker compose up -d

# If migrations ran and need reversing, do this BEFORE up-ing the old image:
docker compose exec -T twenty-server npx nx run twenty-server:typeorm migration:revert -d src/database/typeorm/core/core.datasource.ts
# Repeat per forward migration applied this deploy

docker compose up -d
REMOTE
```

After rollback, open an ops-log entry at `docs/ops-logs/YYYY-MM-DD-wave2-deploy-rollback.md` capturing: failed validation step, log excerpts, image tag of the rollback target, whether the issue is on main (needs fix-PR) or runbook-specific.

---

## Post-deploy — MEMORY.md update (for the next agent)

Commit this to main from your dev machine after a successful soak:

```
Fuse prod running wave 2 + wave 2.5 image as of <date>.
- Image tag: partner-os-<SHORT-SHA>
- TRUST_PROXY=1 verified set
- Stale flag rows cleaned (4 flag keys × N workspaces)
- Apollo: <activated / pending>
- Next sync base: current origin/main tip
```

This signals to future sync agents that wave 2 is fully deployed, not just merged to main.
