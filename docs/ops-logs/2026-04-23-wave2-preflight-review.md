# Wave 2 Pre-flight File Review — 2026-04-23

Scanned main at commit: 196de79cd6 (current HEAD on claude/goofy-rubin-adb902, up to date with origin/main)
Reviewer: feature-dev:code-reviewer subagent

## Summary
- HIGH-RISK files: 10
- MEDIUM-RISK files: 5
- LOW-RISK files: 6
- Active concerns found on main (pre-existing, not introduced by wave 2): 4

---

## HIGH-RISK Files (wave agents: re-verify after ANY cherry-pick that touches these)

| File | Why high risk | Guardrail rule | Current state |
|---|---|---|---|
| `packages/twenty-server/src/modules/partner-os/services/exa-client.service.ts` | Only outbound HTTP in partner-os. Calls `api.exa.ai`. Must not be touched by upstream refactors. | Task 6 Guardrail B: partner-os surface diff must be 0 | CLEAN — outbound only to `api.exa.ai` via `EXA_API_KEY`, no telemetry egress |
| `packages/twenty-server/src/modules/partner-os/services/partner-discovery-orchestrator.service.ts` | Orchestrates all Exa webhook→DB writes. Cross-workspace scan in `findDiscoveryRunByWebsetId` iterates all active workspaces. Any upstream ORM rename can break raw SQL queries silently. | Task 6 Guardrail B | CLEAN — no outbound except to Exa via ExaClientService |
| `packages/twenty-server/src/modules/partner-os/services/partner-os-metadata-bootstrap.service.ts` | Cache thrashing P0 concern (fuse-internal-code-review.md item 2): calls `getFreshFlatMaps()` after every object, field, and relation creation — up to 136+ cache invalidations per bootstrap run. Any upstream change to `WorkspaceManyOrAllFlatEntityMapsCacheService` or `flatEntityMaps` types will break this directly. | Task 6 Guardrail B + run jest partner-os after any touch | ACTIVE CONCERN: cache thrashing not yet mitigated. Each of 3 nested loops calls `getFreshFlatMaps()` on any mutation. |
| `packages/twenty-server/src/modules/partner-os/constants/partner-os-schema.constant.ts` | 1,358-line schema definition; all partner-os object/field/relation/view definitions. Upstream ORM type renames (e.g., `FieldMetadataType`, `RelationType`) would cause TypeScript errors here. | Task 6 Guardrail B | CLEAN — uses `FieldMetadataType` and `RelationType` from `twenty-shared/types` |
| `packages/twenty-server/src/engine/core-modules/enterprise/services/enterprise-plan.service.ts` | Contains 3 live outbound HTTP methods (`getSubscriptionStatus`, `getPortalUrl`, `getCheckoutUrl`) that call `ENTERPRISE_API_URL` (defaults to `https://twenty.com/api/enterprise`). Methods `refreshValidityToken` and `reportSeats` are correctly stubbed, but these 3 are NOT. Called from `enterprise.resolver.ts` via GraphQL. | SPEC-001 "DO NOT CHERRY-PICK" billing surveillance rule | PARTIAL STUB: cron job (`enterprise-key-validation.cron.job.ts`) correctly stubbed. `hasValidEnterpriseKey()` and `isValid()` correctly return `true`. But `getSubscriptionStatus`, `getPortalUrl`, `getCheckoutUrl` remain live. These fire only when a signed `ENTERPRISE_KEY` + `ENTERPRISE_API_URL` are set. Risk: upstream cherry-pick enabling the admin settings UI that calls these resolvers. |
| `packages/twenty-server/src/engine/core-modules/enterprise/cron/jobs/enterprise-key-validation.cron.job.ts` | Enterprise phone-home cron — correctly stubbed with Fuse comment. Any upstream change to this file risks re-enabling the phone-home loop. | SPEC-001 sovereignty charter | CORRECTLY STUBBED: `handle()` is a no-op with comment `Fuse: phone-home disabled` |
| `packages/twenty-shared/src/types/FeatureFlagKey.ts` | The FeatureFlagKey enum has already moved from `twenty-server` to `twenty-shared` on this main. SPEC-001 says this move is a DO-NOT-CHERRY-PICK block (Feature flag removals). The move already happened — `IS_PARTNER_OS_ENABLED` is present. Any wave 2 commit that adds/removes flags from this enum must be reviewed. | Task 7 Guardrail C: IS_PARTNER_OS_ENABLED present check | IS_PARTNER_OS_ENABLED PRESENT at line 18. Enum is at new location in `twenty-shared`. This is a pre-existing state from wave 1 or prior work — wave agents must NOT re-run Guardrail C step 2 (`test -f packages/twenty-shared/src/types/FeatureFlagKey.ts && echo "BLOCK"`) as it will always fire BLOCK. Update: that check is now a false positive; the correct check is whether `IS_PARTNER_OS_ENABLED` is in the file. |
| `packages/twenty-server/src/engine/workspace-manager/dev-seeder/core/utils/seed-feature-flags.util.ts` | Seed file for feature flags. `IS_PARTNER_OS_ENABLED` is NOT in this seed file. Any wave 2 cherry-pick adding new flags here is safe, but removing flags or changing `IS_PARTNER_OS_ENABLED` seeding would break partner-os activation on fresh workspaces. | Task 7 Guardrail C | CONCERN: `IS_PARTNER_OS_ENABLED` is absent from the seed values list (lines 22–73). New workspaces seeded by `seedFeatureFlags` will NOT auto-enable partner-os. Requires manual SPEC-002 backfill. |
| `packages/twenty-server/src/modules/partner-os/controllers/exa-webhook.controller.ts` | Public webhook endpoint at `POST /partner-os/exa-webhook`. HMAC signature verification is conditional on `EXA_WEBHOOK_SECRET` being set — if the env var is absent, signature check is skipped entirely (logged as warning). Any upstream change to `PublicEndpointGuard` or `NoPermissionGuard` could change auth behavior. | Task 6 Guardrail B | CONCERN: if `EXA_WEBHOOK_SECRET` is not set in prod env, any caller can trigger candidate ingestion. Verify env is set in production. |
| `packages/twenty-server/src/modules/partner-os/partner-os.module.ts` | Module registration. Any upstream rename of an imported engine module breaks this. | Task 6 Guardrail B | CLEAN — imports from stable engine paths |

---

## MEDIUM-RISK Files

| File | Why medium risk | Current state |
|---|---|---|
| `packages/twenty-front/src/pages/auth/SignInUp.tsx` | Branded copy ("Welcome to Fuse" at line 129). Upstream will change this back to "Twenty" in wave 2C. | CORRECTLY BRANDED — "Welcome to Fuse" present |
| `packages/twenty-front/src/modules/auth/sign-in-up/components/FooterNote.tsx` | Branded copy + Fuse legal URLs (`fusegtm.com/legal/terms`, `fusegtm.com/legal/privacy`). Upstream will replace with `twenty.com`. | CORRECTLY BRANDED — "By using Fuse", fusegtm.com URLs present |
| `packages/twenty-front/src/pages/not-found/NotFound.tsx` | Branded page title "Page Not Found \| Fuse". | CORRECTLY BRANDED |
| `packages/twenty-front/src/modules/activities/timeline-activities/utils/getTimelineActivityAuthorFullName.ts` | Returns `'Fuse'` as fallback author name (line 14). Upstream returns `'Twenty'`. | CORRECTLY BRANDED |
| `packages/twenty-front/public/manifest.json` | PWA manifest with `"name": "Fuse"`, `"short_name": "Fuse"`, `"description": "Fuse — the partnerships operating system"`. | CORRECTLY BRANDED |

---

## LOW-RISK Files (read, no protective action needed)

| File | Notes |
|---|---|
| `packages/twenty-server/src/modules/partner-os/services/partner-scoring.service.ts` | Pure business logic, no I/O, no external deps. Edge case: when `availableWeight === 0` and `totalWeight === 0`, `fitScore` = 0 and `confidence` = 0. This is intentional. |
| `packages/twenty-server/src/modules/partner-os/services/partner-discovery-adapter.service.ts` | Adapter with no I/O. Throws on >10 retrieval checks. CLEAN. |
| `packages/twenty-front/src/pages/onboarding/SyncEmails.tsx` | Contains branded copy "Sync your Emails and Calendar with Fuse" (line 123). Upstream will revert. MEDIUM risk for wave 2C — add to conflict resolution list. |
| `packages/twenty-front/src/pages/settings/ai/SettingsAIPrompts.tsx` | No "Twenty" strings visible. Reads AI prompt preview from GraphQL. LOW risk. |
| `packages/twenty-server/src/modules/partner-os/crons/jobs/stale-handoff-reminder.cron.job.ts` | Internal DB-only cron, no outbound calls. CLEAN. |
| `packages/twenty-server/src/modules/partner-os/listeners/partner-customer-map-handoff.listener.ts` | Internal DB writes on stage transitions. No outbound calls. SQL inserts use unschema-qualified table names (`"_lead"`, `"_partnerAttributionEvent"`) without the workspace schema prefix — this is a pre-existing bug (see concern #3 below). |

---

## Pre-existing concerns on main

1. **`enterprise-plan.service.ts` lines 235–380 — three live outbound HTTP methods not stubbed.** `getSubscriptionStatus()`, `getPortalUrl()`, `getCheckoutUrl()` make `fetch()` calls to `ENTERPRISE_API_URL` (default `https://twenty.com/api/enterprise`). These are called via GraphQL resolver (`enterprise.resolver.ts` lines 55, 72, 83). They are only reachable when `ENTERPRISE_KEY` and `ENTERPRISE_API_URL` are configured. In Fuse production, `ENTERPRISE_KEY=fuse-org-license-2026` is set (from MEMORY.md). If `ENTERPRISE_API_URL` is also set or defaults, these three methods will make outbound calls to `twenty.com`. The cron job stub correctly blocks the scheduled phone-home; these method stubs are incomplete.

2. **`FeatureFlagKey` enum already moved to `twenty-shared`.** SPEC-001 "DO NOT CHERRY-PICK" section explicitly calls the enum move a deferred block ("Feature flag removals"). On current main, the enum is already at `packages/twenty-shared/src/types/FeatureFlagKey.ts`. This means Guardrail C Task 7 Step 2 will always fire `BLOCK: enum moved` even though this is an already-accepted state. Wave agents must skip that specific check and instead grep `packages/twenty-shared/src/types/FeatureFlagKey.ts` directly for `IS_PARTNER_OS_ENABLED`.

3. **`partner-customer-map-handoff.listener.ts` lines 69, 83 — raw SQL without workspace schema prefix.** The listener queries `FROM "_lead"` and `INSERT INTO "_lead"` (and `"_partnerAttributionEvent"`) without the `"${schemaName}".` prefix. This works only if the search path is set to the correct workspace schema. The `dataSource` comes from `globalWorkspaceOrmManager.getGlobalWorkspaceDataSource()` which is a global connection — the search_path is not guaranteed to be set. This is a pre-existing data isolation bug that may silently write to the wrong workspace schema in multi-tenant environments.

4. **`seed-feature-flags.util.ts` — `IS_PARTNER_OS_ENABLED` not seeded.** New workspaces created after a DB reset will not have `IS_PARTNER_OS_ENABLED = true` in their `featureFlag` table. Partner-os features will be disabled by default on fresh workspaces. Requires SPEC-002 backfill against the production workspace `06e070b2-80eb-4097-8813-8d2ebe632108`.

---

## Wave 2 protective guidance

**For every cherry-pick that touches `packages/twenty-server/src/modules/partner-os/`:**
- Run: `cd packages/twenty-server && npx jest partner-os --config=jest.config.mjs`
- Verify diff is zero: `git diff main... -- packages/twenty-server/src/modules/partner-os/ | wc -l`
- If non-zero: classify per Task 6 Step 2 (accidental cascade vs logic change).

**For every cherry-pick touching `packages/twenty-server/src/engine/core-modules/enterprise/`:**
- After cherry-pick, re-verify: `grep -n "Fuse: no outbound phone-home" packages/twenty-server/src/engine/core-modules/enterprise/services/enterprise-plan.service.ts`
- Verify stubs still at lines for `refreshValidityToken` and `reportSeats`.
- Verify `hasValidEnterpriseKey()` and `isValid()` still return `true` unconditionally.
- Alert if new outbound `fetch()` calls appear in `enterprise-plan.service.ts`.

**For Guardrail C (feature flag drift) — updated check:**
- DO NOT use `test -f packages/twenty-shared/src/types/FeatureFlagKey.ts && echo "BLOCK"` — it will always fire. The enum is already in twenty-shared.
- CORRECT check: `grep -n 'IS_PARTNER_OS_ENABLED' packages/twenty-shared/src/types/FeatureFlagKey.ts || echo "BLOCK: partner-os flag missing"`

**For every wave 2C cherry-pick touching branding files:**
- Files to protect: `SignInUp.tsx`, `FooterNote.tsx`, `NotFound.tsx`, `SyncEmails.tsx`, `getTimelineActivityAuthorFullName.ts`, `manifest.json`
- On any conflict with these files: `git checkout HEAD -- <path>` to keep Fuse version, then `git cherry-pick --continue`
- Verify after resolution: grep for "Twenty" in those files → must return 0 matches.

**After any wave 2B cherry-pick touching `FeatureFlagKey`:**
- Verify `IS_PARTNER_OS_ENABLED` still present in `packages/twenty-shared/src/types/FeatureFlagKey.ts`
- Verify `seed-feature-flags.util.ts` still imports from `twenty-shared/types` (not old enum path)

**Webhook endpoint security:**
- Verify `EXA_WEBHOOK_SECRET` is set in production environment before any wave merge that touches webhook infra.
- If `exa-webhook.controller.ts` is touched, confirm `verifySignature` still requires HMAC check when secret is set.

---

## Decisions (2026-04-23, after CTO review)

### Concern #1 — `enterprise-plan.service.ts` live outbound methods: **ACCEPTED AS-IS (Option A)**

Updated context: prod is running a **real signed Twenty enterprise key**, not the dummy `fuse-org-license-2026` earlier memory suggested. With a valid JWT, `cachedKeyPayload` is populated → all three methods pass their guards → they DO call `https://twenty.com/api/enterprise/{status,portal,checkout}`. This is intentional: these three methods drive the billing admin UX (subscription status display, Stripe portal deep-link, upgrade checkout) tied to the paid enterprise subscription. Twenty already holds the key identity, so the outbound is not new information leakage. Admin-panel-only; no user-facing path.

Action: none. Do not hard-stub. Do not alter config default. Wave agents: if upstream cherry-picks ever add new outbound fetches to `enterprise-plan.service.ts`, still flag for review; additions require explicit decision.

Future consideration (not this sprint): Option B (add 5s `AbortController` timeouts to the three fetches) remains available if twenty.com uptime becomes a visible admin-panel issue.

### Concern #2 — `partner-customer-map-handoff.listener.ts` raw SQL without schema prefix: **DEAD CODE (NO ACTION)**

Verified: `GlobalWorkspaceDataSource.query()` at `global-workspace-datasource.ts:233` throws `PermissionsException` unless `options.shouldBypassPermissionChecks: true` is passed. The listener calls without that option → every invocation throws → caught by its try/catch → silently logs. Handoff SQL never actually executes. Data isolation concern is moot. The listener itself is dead code, which is a separate behavioural gap worth tracking but not a wave-2 blocker.

Action: none. Listener-dead-code concern added to partner-os follow-up backlog.

### Concern #3 — `IS_PARTNER_OS_ENABLED` not in seed file: **OPT-IN BY DESIGN (NO ACTION)**

Verified: `onboarding.service.ts:91` handles the flag-absent case cleanly — if the flag is off, the `ONBOARDING_PARTNER_PROFILE_PENDING` user var is silently cleared and the onboarding flow moves past the partner-profile step. New workspaces simply don't see partner-os UI until the flag is explicitly activated (e.g., by running the SPEC-002 backfill for the specific workspace). Existing prod workspace `06e070b2-80eb-4097-8813-8d2ebe632108` already has the flag set.

Action: none. SPEC-002 remains the correct activation pattern when onboarding a new workspace intentionally to partner-os.

### Net effect on wave 2

All three "pre-existing concerns" resolved as no-action-needed. Guardrail protection rules in the Wave 2 Protective Guidance section (above) still apply as-written — wave executors should still diff the partner-os surface, grep-verify enterprise stubs stay intact, and protect branded copy on conflict. The concerns section above is retained as historical context, not an open task list.
