# Apollo Enrichment Activation Runbook (formerly "wave 3")

> **NOT a cherry-pick wave.** The upstream commit `b1107c823a` (#18277 Apollo enrich app) is already on Fuse main — ledger row 34, deferred as "already landed". Directory `packages/twenty-apps/community/apollo-enrich/` is present. Wave 2D added the flag/RBAC scaffolding. Apollo just needs **activation**, which is env-var + admin-UI + OAuth credential work — all infra/ops domain, not code.

**Prerequisite:** Wave 2 must be merged + deployed to Fuse prod EC2 (`i-05b90467e22fec9d2`). Current prod runs pre-wave-2 image; do not attempt Apollo activation until the post-wave-2 image is live.

## Scope

This runbook lives here so the founder and any future agent know **exactly** what to do to turn Apollo on. It is not an agent-dispatchable workflow — most steps are UI clicks in the admin settings panel or SSH edits to prod `.env`. Each step lists which actor performs it.

## Pre-flight checklist (before activation)

- [ ] Wave 2 merged to main — status confirmable via `docs/ops-logs/2026-04-23-wave2-closeout.md` existence
- [ ] Wave 2 deployed to prod — SPEC-004 deploy runbook executed, new image tag visible at `app.fusegtm.com` + `/api/version` endpoint reports post-wave-2 SHA
- [ ] `TRUST_PROXY=1` verified set in prod `.env` (separate action item from wave 2A)
- [ ] `docs/ops-logs/2026-04-23-wave2a-watch-items.md` decisions reviewed

## Step 1 — Verify app on main (agent-checkable)

```bash
# Runs from any worktree of fuse-v1
ls packages/twenty-apps/community/apollo-enrich/
cat packages/twenty-apps/community/apollo-enrich/manifest.json | head -20
```

Expected:
- Directory exists with `manifest.json` + `src/*.ts` files
- Manifest declares the Apollo enrichment scope and OAuth config

If missing: stop. Wave 1/2 didn't complete the expected state. File a regression issue before continuing.

## Step 2 — Verify feature flags on prod workspace (user via Postgres MCP or SSH to DB)

Against prod workspace `06e070b2-80eb-4097-8813-8d2ebe632108`:

```sql
SELECT "key", "value" FROM core."featureFlag"
WHERE "workspaceId" = '06e070b2-80eb-4097-8813-8d2ebe632108'
  AND "key" IN ('IS_APPLICATION_ENABLED', 'IS_MARKETPLACE_ENABLED', 'IS_PARTNER_OS_ENABLED');
```

Expected rows (all `value = true`):
- `IS_APPLICATION_ENABLED = true`
- `IS_MARKETPLACE_ENABLED = true`
- `IS_PARTNER_OS_ENABLED = true`

Any `false` or missing row: run the SPEC-002 backfill for that flag against workspace `06e070b2-80eb-4097-8813-8d2ebe632108`. See `docs/agent-specs/SPEC-002-feature-flag-backfill.md`.

## Step 3 — Set env vars on prod EC2 (user SSH)

```bash
ssh ec2-user@52.20.136.71
cd /path/to/packages/twenty-docker
cat >> .env <<'EOF'

# Apollo enrichment activation (2026-04-24)
COMPANY_ENRICHMENT_ENABLED=true
COMPANY_ENRICHMENT_PROVIDER=twenty
EOF
docker compose restart twenty-server twenty-worker
```

Verify:
```bash
docker compose exec twenty-server env | grep COMPANY_ENRICHMENT
# Should show both values
```

## Step 4 — Install the Apollo app in the prod workspace (user via admin UI or GraphQL)

**Option A — admin UI:**
1. Sign in to `app.fusegtm.com` as workspace admin
2. Settings → Applications → Browse marketplace
3. Find "Apollo enrichment" → Install
4. Accept OAuth scopes as prompted

**Option B — GraphQL (programmatic):**
```graphql
mutation {
  installApplication(
    input: {
      appId: "apollo-enrich"
      workspaceId: "06e070b2-80eb-4097-8813-8d2ebe632108"
    }
  ) {
    id
    status
  }
}
```

Run via the Fuse admin GraphQL endpoint (authenticated with admin user JWT).

## Step 5 — Configure OAuth credentials (user via Apollo.io + Fuse admin UI)

1. In Apollo.io: create an OAuth app (Developer → Applications → New app). Redirect URI: `https://app.fusegtm.com/api/applications/apollo-enrich/oauth/callback`.
2. Copy client ID + secret from Apollo.
3. In Fuse admin UI: Settings → Applications → Apollo enrichment → OAuth credentials → paste client ID + secret. Save.
4. Click "Authorize" — runs the OAuth flow and stores refresh token in `core."applicationVariable"`.

## Step 6 — Smoke test enrichment (user)

1. In Fuse: navigate to any Company record.
2. In the record's right-panel, trigger "Enrich with Apollo" (the exact affordance name depends on the app's UI definition).
3. Wait ~3-10 seconds.
4. Verify the following fields populate:
   - `logoUrl` (or equivalent)
   - `employeeCount`
   - `industry`
   - `linkedinUrl`
   - `phone` (if public)

Also check `core."applicationEvent"` table for an `APOLLO_ENRICHMENT_TRIGGERED` audit row.

If enrichment fails silently, check `docker compose logs twenty-server --since=5m | grep -i apollo` for OAuth token errors.

## Step 7 — Migrate partner-os to Apollo provider (OPTIONAL, future)

SPEC-005 Path 2. Not part of this activation. Tracks:
- Add `ApolloEnrichmentProvider` to `partner-discovery-adapter.service.ts` alongside the existing Exa adapter
- Map Apollo API response fields to `trackEnrichment` field definitions
- Feature-flag gate the new path per workspace

Scope this as a separate engineering task after the Apollo flow is stable via Path 1.

## Rollback

If Apollo activation breaks production:

```bash
ssh ec2-user@52.20.136.71
cd /path/to/packages/twenty-docker
# Revert env vars
sed -i '/COMPANY_ENRICHMENT_ENABLED=true/d; /COMPANY_ENRICHMENT_PROVIDER=twenty/d' .env
docker compose restart twenty-server twenty-worker
```

Then uninstall the app via admin UI or GraphQL:

```graphql
mutation {
  uninstallApplication(input: {
    appId: "apollo-enrich"
    workspaceId: "06e070b2-80eb-4097-8813-8d2ebe632108"
  }) { id }
}
```

## Ownership

- **Founder (user):** all prod SSH / admin-UI / Apollo.io portal steps.
- **Any agent:** pre-flight checks on the fuse-v1 repo (Step 1 verification; drafting env additions for review).

No agent should execute Steps 3-6 autonomously — they involve production infrastructure, third-party OAuth, and first-time credential handling that requires human-in-the-loop.
