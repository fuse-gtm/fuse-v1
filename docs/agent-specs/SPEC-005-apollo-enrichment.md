# SPEC-005: Apollo Enrichment Integration

## Context

Upstream Twenty added a first-party Apollo.io enrichment app in commit
`b1107c823a` (PR #18277). This app lives in `packages/twenty-apps/community/apollo-enrich/`
and uses OAuth 2 to enrich `Company` and `Person` objects with data from Apollo.

Our fork does not have this commit. There are two integration paths:
1. Cherry-pick the upstream Apollo app (uses Twenty's app framework)
2. Build a partner-os native adapter (maps to `trackEnrichment` objects)

Path 1 is faster for MVP. Path 2 is the long-term architecture. This spec
covers Path 1 with hooks for Path 2.

## Dependencies

- SPEC-001 Block 2 (Linaria migration) — not strictly required, but the app
  framework UI uses patterns from the post-Linaria codebase
- `IS_APPLICATION_ENABLED` feature flag must be `true` (already seeded)
- `COMPANY_ENRICHMENT_ENABLED=true` in `.env` (currently `false`, see SPEC-002)

## Upstream Apollo App Architecture

### Location
```
packages/twenty-apps/community/apollo-enrich/
├── manifest.json          # App metadata, scopes, OAuth config
├── src/
│   ├── index.ts           # Entry point
│   ├── enrich-company.ts  # Company enrichment logic
│   ├── enrich-person.ts   # Person enrichment logic
│   └── apollo-client.ts   # Apollo API client wrapper
```

### How It Works

1. User installs the Apollo app from the marketplace (or via API)
2. OAuth 2 flow authenticates with Apollo.io
3. On trigger (manual or webhook), the app:
   - Reads a `Company` or `Person` record from Twenty
   - Calls Apollo's enrichment API with domain/email
   - Writes enriched fields back to the record (logo, employee count,
     industry, LinkedIn URL, phone numbers, etc.)

### Upstream Commit Details

| Field | Value |
|-------|-------|
| Commit | `b1107c823a` |
| PR | #18277 |
| Title | Add Apollo.io enrichment community app |
| Files changed | ~15 (new directory, no modifications to core) |

### Conflict Risk: LOW

The app lives in its own directory under `packages/twenty-apps/`. No overlap
with partner-os code or any existing files in our fork.

## Implementation: Path 1 (Cherry-Pick)

### Step 1: Cherry-Pick the Upstream App

```bash
git cherry-pick b1107c823a --no-commit
git diff --cached --stat
# Verify: only files in packages/twenty-apps/community/apollo-enrich/
git commit -m "feat: cherry-pick Apollo enrichment app from upstream (#18277)"
```

### Step 2: Enable the App Framework

Verify these flags/env values are set:

```bash
# In .env
COMPANY_ENRICHMENT_ENABLED=true
COMPANY_ENRICHMENT_PROVIDER=twenty
```

```sql
-- Feature flags (should already exist per SPEC-002)
SELECT "key", "value" FROM core."featureFlag"
WHERE "workspaceId" = '06e070b2-80eb-4097-8813-8d2ebe632108'
  AND "key" IN ('IS_APPLICATION_ENABLED', 'IS_MARKETPLACE_ENABLED');
```

**Expected:** Both `true`.

### Step 3: Install the App in Production Workspace

Via the Twenty API or MCP:

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

Then configure OAuth credentials in the app settings UI.

### Step 4: Verify Enrichment

1. Navigate to a Company record in the Fuse UI
2. Trigger enrichment (via the app action or manually)
3. Verify enriched fields are populated (logo, employee count, etc.)

## Implementation: Path 2 (Partner-OS Native — Future)

This is the long-term path. It maps Apollo enrichment to the partner-os
discovery pipeline.

### Architecture

```
Apollo API
  ↓
PartnerDiscoveryAdapterService (existing)
  ↓ maps to
trackEnrichment object (existing schema)
  ↓ evaluated by
enrichmentEvaluation object (existing schema)
  ↓ scores feed into
PartnerScoringService (existing)
```

### Key Changes (Not for MVP)

1. Add `ApolloEnrichmentProvider` to `partner-discovery-adapter.service.ts`
   alongside the existing Exa adapter
2. Map Apollo API response fields to `trackEnrichment` field definitions
3. Add enrichment source discriminator (`exa` vs `apollo`) to
   `enrichmentEvaluation` records
4. Wire Apollo OAuth token storage through Twenty's app credentials system

### Why Not Now

- The upstream app already handles OAuth, API calls, and field mapping
- Building a native adapter duplicates this work for zero user-facing benefit
- The native path becomes valuable when enrichment results need to feed
  directly into partner scoring (post-MVP, when discovery runs use multiple
  enrichment sources simultaneously)

## Preflight Sovereignty Note

The deploy preflight (SPEC-004) currently enforces
`COMPANY_ENRICHMENT_ENABLED=false` in strict sovereignty mode because the
`twenty` enrichment provider calls Twenty's servers for company logos/avatars.

To use Apollo enrichment while keeping sovereignty:

**Option A:** Set `COMPANY_ENRICHMENT_PROVIDER=apollo` (direct to Apollo, no
Twenty intermediary). This requires the Apollo app to be installed and
configured.

**Option B:** Temporarily disable strict sovereignty for the enrichment check:
```bash
# In preflight, change:
# require_strict_value COMPANY_ENRICHMENT_ENABLED false
# to:
# require_strict_value COMPANY_ENRICHMENT_PROVIDER apollo
```

**Option C:** Keep enrichment disabled at the env level and use only the
Apollo app's per-record enrichment (manual trigger, no background enrichment).
This is the safest MVP path.

**Recommended for MVP:** Option C. Enable the Apollo app for on-demand
enrichment. Keep `COMPANY_ENRICHMENT_ENABLED=false` to avoid any background
calls to Twenty's servers. Revisit when the native adapter (Path 2) is built.

## Acceptance Criteria

- [ ] Apollo enrichment app exists in `packages/twenty-apps/community/apollo-enrich/`
- [ ] `IS_APPLICATION_ENABLED` and `IS_MARKETPLACE_ENABLED` flags are `true`
- [ ] App installs successfully in production workspace
- [ ] Company enrichment returns data from Apollo (logo, employee count, industry)
- [ ] No background calls to Twenty's servers (sovereignty preserved)
- [ ] Enrichment works on-demand (manual trigger per record)

## Guard Rails

- Do NOT set `COMPANY_ENRICHMENT_ENABLED=true` with `COMPANY_ENRICHMENT_PROVIDER=twenty`
  in production. This calls Twenty's servers, not Apollo's.
- The Apollo app requires valid OAuth credentials. Without them, enrichment
  silently returns empty results.
- Apollo API has rate limits (varies by plan). Do not trigger bulk enrichment
  on initial deploy — test with single records first.
- The upstream app writes directly to `Company`/`Person` objects (Twenty core).
  It does NOT write to partner-os custom objects. Path 2 bridges this gap.
- Do not modify the cherry-picked app code. If customization is needed,
  create a separate `fuse-apollo-enrich` app that wraps or extends it.
