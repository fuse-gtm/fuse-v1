# SPEC-002: Feature Flag Backfill

## Context

Feature flags in Twenty are per-workspace rows in the `core."featureFlag"` table.
New flags are only seeded when a workspace is created (via `seed-feature-flags.util.ts`).
Existing workspaces — including our production workspace — may be missing flags
added after creation.

Our fork has 25 flags in the enum. The seed file sets 20 of them. Four flags
are not seeded at all. One of those (`IS_PARTNER_OS_ENABLED`) is our custom
flag that gates the partner profile onboarding flow.

## Production workspace

- Workspace ID: `06e070b2-80eb-4097-8813-8d2ebe632108`
- Core schema: `core`

## Flags in the enum vs seed file

| Flag | In Enum | Seeded | Default | Action |
|------|---------|--------|---------|--------|
| `IS_UNIQUE_INDEXES_ENABLED` | Yes | Yes | `false` | None |
| `IS_JSON_FILTER_ENABLED` | Yes | No | — | Add to seed as `true` |
| `IS_AI_ENABLED` | Yes | Yes | `true` | None |
| `IS_APPLICATION_ENABLED` | Yes | Yes | `true` | None |
| `IS_APPLICATION_INSTALLATION_FROM_TARBALL_ENABLED` | Yes | No | — | Skip (being removed upstream) |
| `IS_MARKETPLACE_ENABLED` | Yes | Yes | `true` | None |
| `IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED` | Yes | Yes | `true` | None |
| `IS_PUBLIC_DOMAIN_ENABLED` | Yes | Yes | `true` | None |
| `IS_EMAILING_DOMAIN_ENABLED` | Yes | Yes | `true` | None |
| `IS_DASHBOARD_V2_ENABLED` | Yes | Yes | `true` | None |
| `IS_ATTACHMENT_MIGRATED` | Yes | Yes | `true` | None |
| `IS_NOTE_TARGET_MIGRATED` | Yes | Yes | `true` | None |
| `IS_TASK_TARGET_MIGRATED` | Yes | Yes | `true` | None |
| `IS_FILES_FIELD_MIGRATED` | Yes | Yes | `true` | None |
| `IS_CORE_PICTURE_MIGRATED` | Yes | Yes | `true` | None |
| `IS_OTHER_FILE_MIGRATED` | Yes | Yes | `true` | None |
| `IS_ROW_LEVEL_PERMISSION_PREDICATES_ENABLED` | Yes | Yes | `true` | None |
| `IS_JUNCTION_RELATIONS_ENABLED` | Yes | Yes | `true` | None |
| `IS_COMMAND_MENU_ITEM_ENABLED` | Yes | Yes | `true` | None |
| `IS_NAVIGATION_MENU_ITEM_ENABLED` | Yes | Yes | `true` | None |
| `IS_DATE_TIME_WHOLE_DAY_FILTER_ENABLED` | Yes | Yes | `true` | None |
| `IS_NAVIGATION_MENU_ITEM_EDITING_ENABLED` | Yes | Yes | `true` | None |
| `IS_DRAFT_EMAIL_ENABLED` | Yes | No | — | Add to seed as `true` |
| `IS_PARTNER_OS_ENABLED` | Yes | No | — | **Add to seed as `true`** (gates partner onboarding) |

## Implementation

### Step 1: Add missing flags to seed file

File: `packages/twenty-server/src/engine/workspace-manager/dev-seeder/core/utils/seed-feature-flags.util.ts`

Add to the `.values([...])` array, after the last existing entry:

```typescript
{
  key: FeatureFlagKey.IS_JSON_FILTER_ENABLED,
  workspaceId: workspaceId,
  value: true,
},
{
  key: FeatureFlagKey.IS_DRAFT_EMAIL_ENABLED,
  workspaceId: workspaceId,
  value: true,
},
{
  key: FeatureFlagKey.IS_PARTNER_OS_ENABLED,
  workspaceId: workspaceId,
  value: true,
},
```

Do NOT add `IS_APPLICATION_INSTALLATION_FROM_TARBALL_ENABLED` — it is being
removed upstream and adds no value.

### Step 2: Backfill existing production workspace

Run this SQL against the core database (via psql, MCP, or a migration):

```sql
INSERT INTO core."featureFlag" ("id", "key", "workspaceId", "value")
VALUES
  (gen_random_uuid(), 'IS_JSON_FILTER_ENABLED', '06e070b2-80eb-4097-8813-8d2ebe632108', true),
  (gen_random_uuid(), 'IS_DRAFT_EMAIL_ENABLED', '06e070b2-80eb-4097-8813-8d2ebe632108', true),
  (gen_random_uuid(), 'IS_PARTNER_OS_ENABLED', '06e070b2-80eb-4097-8813-8d2ebe632108', true)
ON CONFLICT DO NOTHING;
```

Alternative via MCP bootstrap (if direct SQL is not available):
Use `execute_tool` with `createOneFeatureFlag` for each flag.

### Step 3: Verify

Query the featureFlag table to confirm all 23 expected flags exist for the workspace:

```sql
SELECT "key", "value"
FROM core."featureFlag"
WHERE "workspaceId" = '06e070b2-80eb-4097-8813-8d2ebe632108'
ORDER BY "key";
```

Expected: 23 rows, all `true` except `IS_UNIQUE_INDEXES_ENABLED` (`false`).

## Env-level config (not per-workspace)

These are set in `.env`, not in the featureFlag table:

| Setting | Current | Recommended | Notes |
|---------|---------|-------------|-------|
| `COMPANY_ENRICHMENT_ENABLED` | `false` | `true` | Enables company logo/avatar fetching |
| `COMPANY_ENRICHMENT_PROVIDER` | `none` | `twenty` | Uses Twenty's built-in enrichment (no API key) |
| `TELEMETRY_ENABLED` | `false` | Keep `false` | No phone-home |
| `ANALYTICS_ENABLED` | `false` | Keep `false` | No ClickHouse |
| `AI_TELEMETRY_ENABLED` | `false` | Keep `false` | |
| `ADMIN_VERSION_CHECK_ENABLED` | `false` | Keep `false` | Calls Twenty servers |
| `MARKETPLACE_REMOTE_FETCH_ENABLED` | `false` | Keep `false` | Fetches from Twenty's servers |
| `HELP_CENTER_SEARCH_ENABLED` | `false` | Keep `false` | Calls Twenty's help center API |

## Acceptance criteria

- [ ] Seed file has 23 flags (20 existing + 3 new)
- [ ] Production workspace has all 23 flags
- [ ] `IS_PARTNER_OS_ENABLED` is `true` for production workspace
- [ ] `.env` has `COMPANY_ENRICHMENT_ENABLED=true`
- [ ] No telemetry/analytics/version-check flags are accidentally enabled

## Guard rails

- The `featureFlag` table uses `ON CONFLICT DO NOTHING` — re-running is safe.
- Do NOT modify or delete existing flag rows. Only insert missing ones.
- Do NOT change flag values for existing rows without explicit approval.
- The `IS_PARTNER_OS_ENABLED` flag gates `onboardingService.setOnboardingPartnerProfilePending()`
  in `sign-in-up.service.ts`. If missing, new users skip partner profile setup.
