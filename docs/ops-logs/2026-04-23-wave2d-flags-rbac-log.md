# Wave 2D Flags + RBAC Cherry-pick Log — 2026-04-23

Branch: `integration/upstream-wave2-flags-rbac`
Base: `39c3d31be0d512b9c392cbeb2354261412e3a341` (post-2C `origin/main`, PR #21 branding nits merge)
Ledger: `docs/fuse-upstream-patch-ledger.md` (rows where Wave = `2D-flags-rbac`, 16 commits)

## Summary

- Cherry-picks attempted: 16
- Cherry-picks successful: 11
- Cherry-picks skipped: 5
- Branded-file preservations (rule 5): 0
- Partner-OS protections triggered (rule 2): 1 (cascading — see f6423f5925)
- Enterprise-module aborts (rule 1): 0
- IS_PARTNER_OS_ENABLED enum status: **PRESENT** (defended through the entire wave)

## Applied cherry-picks

In chronological (cherry-pick) order:

| # | SHA | PR | Title |
|---|-----|----|-------|
| 1 | `be9616db60` | #19842 | chore: remove draft email feature flag |
| 2 | `a3f468ef98` | #19082 | chore: remove IS_ROW_LEVEL_PERMISSION_PREDICATES_ENABLED and IS_DATE_TIME_WHOLE_DAY_FILTER_ENABLED feature flags |
| 3 | `08b041633a` | #19083 | chore: remove 1-19 upgrade commands and navigation menu item feature flags |
| 4 | `5eaabe95e7` | #19469 | Fix role synchronisation |
| 5 | `07745947ee` | #19511 | Fix rolesPermissions cache query cartesian product (62k → 162 rows) |
| 6 | `65b2baca7a` | #19566 | Remove IS_USAGE_ANALYTICS_ENABLED feature flag |
| 7 | `69d228d8a1` | #19662 | Deprecate IS_RECORD_TABLE_WIDGET_ENABLED feature flag |
| 8 | `bc28e1557c` | #19441 | Introduce updateWorkspaceMemberSettings and clarify product |
| 9 | `bb464b2ffb` | #19783 | Forbid other app role extension |
| 10 | `30b8663a74` | #19916 | chore: remove IS_AI_ENABLED feature flag |
| 11 | `921a0f01c8` | #19982 | Forbid permissions update cross app role retarget |

Final HEAD: `e8644c9d59` (Forbid permissions update cross app role retarget #19982).

Note on ordering: `be9616db60` (draft-email flag) was applied first as a warm-up — its upstream timestamp sits later in the ledger (row 1109) but the commit applies cleanly against post-2C main with no conflicts, so it was taken out of order to establish a clean cherry-pick baseline before tackling the messier conflicts.

## Skipped cherry-picks

| SHA | Reason code | Notes |
|---|---|---|
| `b11f77df2a` | massive-cross-wave-refactor-conflicts | #18319 [FRONT COMPONENTS] Introduce conditionalAvailabilityExpression — 349-file command-menu refactor with 195 conflicts; FeatureFlagKey is incidental touch. Misclassified as 2D; this is a pure frontend/command-menu change, not a flags/RBAC change. |
| `cee4cf6452` | massive-cross-wave-refactor-conflicts | #18784 ConnectedAccount metadata-schema migration — 149-file rewrite with 122 conflicts. FeatureFlagKey touch is incidental. |
| `d5a7dec117` | massive-cross-wave-refactor-conflicts | #18830 ObjectMetadataItem → EnrichedObjectMetadataItem rename — 440-file refactor. Too large for structured cherry-pick; architectural change well outside 2D scope. |
| `e8cb086b64` | partial-semantic-overlap | #19074 "remove completed migration feature flags <=1.18" — already partially applied via Fuse-authored commit `8ecf1018a0` ("chore: remove completed migration feature flags and upgrade commands <= 1.18 (#1…"). The upstream commit tries to re-add 1.19 upgrade commands that a later commit (`08b041633a` / #19083) already removed from our tree; reverse-direction conflict would fight against subsequent cherry-picks in this same wave. |
| `f6423f5925` | partner-os-conflict (cascading) | #19532 "Remove DataSourceService and clean up datasource migration logic" — deletes `packages/twenty-server/src/engine/metadata-modules/data-source/{data-source.module.ts,data-source.service.ts,data-source.exception.ts}`. Our `packages/twenty-server/src/modules/partner-os/` imports all three from that path:<br/>- `partner-os-seed.command.ts` imports `DataSourceService`<br/>- `partner-os-seed.module.ts` imports `DataSourceModule`<br/>- `partner-os.module.ts` imports `DataSourceModule`<br/>- `partner-os-metadata-bootstrap.service.ts` imports `DataSourceService`<br/>Applying the commit would force us to rewrite partner-os modules, which rule 2 forbids. The cherry-pick was applied and then reverted (`git reset --hard HEAD~2`) after the cascade was discovered. |

## Conflict resolutions (applied cherry-picks)

Resolution strategy per conflict rule:

- **Feature-flag enum / seed**: merged to converge on upstream's removal set while preserving `IS_PARTNER_OS_ENABLED`. In cases where the upstream diff was applied against an older enum shape and would have reintroduced already-removed Fuse flags (e.g. `IS_DRAFT_EMAIL_ENABLED` reappearing mid-`a3f468ef98`, `IS_NAVIGATION_MENU_ITEM_*` during `a3f468ef98`), favored HEAD's current removal state to avoid churn.
- **GraphQL codegen outputs** (`schema.graphql`, `schema.ts`, `graphql.ts`): favored upstream via `git checkout --theirs` per rule 8. CI must re-run `npx nx run twenty-front:graphql:generate` and `twenty-front:graphql:generate --configuration=metadata`, confirm zero diff.
- **Upgrade-command modules** (`upgrade-version-command.module.ts`, `1-21/1-21-upgrade-version-command.module.ts`): favored HEAD — our origin/main has already removed 1.19 commands and the `V1_20_UpgradeVersionCommandModule` / `V1_22_UpgradeVersionCommandModule` wiring that upstream still references. Accepting upstream would import non-existent modules.
- **`UsageResolver` `MetadataResolver` decorator import** (`usage.resolver.ts`): took upstream — the decorator is used on the class body and the import was genuinely missing on our side.
- **`SettingsBillingCreditsSection.tsx`**: kept HEAD — our version has the additional `How credits work` external-link button; `getDocumentationUrl` is in use (2 call sites).
- **`user.resolver.ts` `updateWorkspaceMember` body** (bc28e1557c): kept HEAD's structure — Fuse-added `onboardingService.completeOnboardingProfileStepIfNameProvided(...)` call plus HEAD's `targetUserWorkspace` hoist out of the `isDefined(locale)` branch.

### Surgical fixes

- **07745947ee**: the cherry-pick created `1-22-instance-command-fast-1775749486425-auto-generated.ts` with the same migration timestamp (1775749486425) as the pre-existing `1-22-instance-command-fast-1775749486425-add-permission-flag-role-id-index.ts`. The two files defined the same index with the same timestamp. Removed `auto-generated.ts` and amended the cherry-pick commit before moving on. This amend was limited to the just-applied cherry-pick in the same step — no prior commits touched.

- **30b8663a74**: `packages/twenty-front/src/generated-admin/graphql.ts` was "DU" (deleted in our HEAD, modified upstream). Kept the deletion.

## Flag diff

### Enum delta (`packages/twenty-shared/src/types/FeatureFlagKey.ts`)

| | Pre-wave | Post-wave |
|---|---|---|
| `IS_*` keys | 17 | 13 |
| File lines | 19 | 17 |
| `IS_PARTNER_OS_ENABLED` present | 1 | 1 |

**Flags removed (present pre-wave, absent post-wave):**

- `IS_DRAFT_EMAIL_ENABLED` (via be9616db60)
- `IS_USAGE_ANALYTICS_ENABLED` (via 65b2baca7a)
- `IS_RECORD_TABLE_WIDGET_ENABLED` (via 69d228d8a1)
- `IS_AI_ENABLED` (via 30b8663a74)

**Flags added (absent pre-wave, present post-wave):** none net. The deprecated-via-comment `IS_DATASOURCE_MIGRATED` flag remains; no new flags were introduced.

**Flags defended (present pre-wave, must remain present post-wave):**

- `IS_PARTNER_OS_ENABLED` — confirmed PRESENT on final HEAD. At no point mid-wave did any resolved-conflict file remove or rename this flag.

### Seed-file delta (`seed-feature-flags.util.ts`)

First 60 lines of diff vs pre-wave snapshot (`/tmp/wave2d-pre-seed.ts`):

```diff
29,33d28
<         key: FeatureFlagKey.IS_AI_ENABLED,
<         workspaceId: workspaceId,
<         value: true,
<       },
<       {
59,63d53
<         key: FeatureFlagKey.IS_USAGE_ANALYTICS_ENABLED,
<         workspaceId: workspaceId,
<         value: true,
<       },
<       {
68,72d57
<       {
<         key: FeatureFlagKey.IS_RECORD_TABLE_WIDGET_ENABLED,
<         workspaceId: workspaceId,
<         value: true,
<       },
```

Three flags dropped from the default-seed list, matching the three flag-removal commits. `IS_DRAFT_EMAIL_ENABLED` was not in the seed list pre-wave (it was only in the enum). Seed file parses as TypeScript syntactically (no stray merge markers, balanced braces).

### `DEFAULT_FEATURE_FLAGS` constant

Pre-wave HEAD: `[IS_RECORD_PAGE_LAYOUT_GLOBAL_EDITION_ENABLED, IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED]`
Post-wave: `[]` (upstream e8cb086b64 semantically applied via its sibling a3f468ef98 resolution — the constant was already emptied by Fuse's earlier 8ecf1018a0 partial-backport).

## Permissions-stack delta

| Path | Pre | Post | Delta |
|---|---|---|---|
| `packages/twenty-server/src/**/permissions/*.ts` | 11 | 11 | 0 |

Note: the actual RBAC changes in this wave (role synchronisation fix 5eaabe95e7, cache cartesian-product fix 07745947ee, forbid-cross-app-role 9998329420, workspace-member-settings DTO fc863e34ee, permission-retarget guard e8644c9d59) land inside:

- `packages/twenty-server/src/engine/metadata-modules/role/**`
- `packages/twenty-server/src/engine/metadata-modules/object-permission/**`
- `packages/twenty-server/src/engine/metadata-modules/field-permission/**`
- `packages/twenty-server/src/engine/metadata-modules/permission-flag/**`
- `packages/twenty-server/src/engine/core-modules/application/application-manifest/**`

…not under any `permissions/` literal subdirectory. The file-count snapshot therefore under-reports the real RBAC surface change. See the full diff via `git diff origin/main...HEAD --stat` for the complete list; deep reviewer should focus on:

- role-validation utilities (`packages/twenty-server/src/engine/workspace-manager/workspace-migration/workspace-migration-builder/validators/utils/validate-role-belongs-to-caller-application.util.ts` — new)
- `validate-permission-operation-cross-app-retarget` (new, via 921a0f01c8)
- `workspace-roles-permissions-cache.service.spec.ts` (new, via bc28e1557c)

## ApplicationLogsService drift

| Count of `+ApplicationLogsService` lines in the wave diff | 0 |

No wave 2D cherry-pick reintroduced ApplicationLogsService imports. `/tmp/wave2d-app-logs-drift.txt` is empty.

## Branded-file preservations

None. The seven Fuse-branded files enumerated in the prompt (`SignInUp.tsx`, `FooterNote.tsx`, `NotFound.tsx`, `SyncEmails.tsx`, `SettingsAiPrompts.tsx`, `getTimelineActivityAuthorFullName.ts`, `manifest.json`) were not conflicted by any applied 2D cherry-pick. Rule 5 did not fire.

## GraphQL codegen touches

9 files matching `*.resolver.ts`, `*.dto.ts`, `*.graphql`, or `generated-metadata/` were modified. Full list:

```
packages/twenty-client-sdk/src/metadata/generated/schema.graphql
packages/twenty-front/src/generated-metadata/graphql.ts
packages/twenty-server/src/engine/core-modules/approved-access-domain/approved-access-domain.resolver.ts
packages/twenty-server/src/engine/core-modules/usage/usage.resolver.ts
packages/twenty-server/src/engine/core-modules/workflow/resolvers/workflow-version-step.resolver.ts
packages/twenty-server/src/engine/metadata-modules/ai/ai-agent/agent.resolver.ts
packages/twenty-server/src/engine/metadata-modules/ai/ai-chat/resolvers/agent-chat-subscription.resolver.ts
packages/twenty-server/src/engine/metadata-modules/ai/ai-chat/resolvers/agent-chat.resolver.ts
packages/twenty-server/src/engine/metadata-modules/role/role.resolver.ts
```

CI must re-run `npx nx run twenty-front:graphql:generate` and `twenty-front:graphql:generate --configuration=metadata`, confirm zero diff.

## Verification status

**Local:** deferred to CI. Sandbox disallows `yarn install`; no lint/typecheck/jest invocations possible on this executor.

**CI-required checks before merge:**

- `NODE_OPTIONS="--max-old-space-size=8192" npx nx lint:diff-with-main twenty-server`
- `npx nx lint:diff-with-main twenty-front`
- `npx nx typecheck twenty-server`
- `npx nx typecheck twenty-front`
- `npx nx test twenty-server`
- `npx nx test twenty-front`
- `npx nx run twenty-server:test:integration:with-db-reset` — the added role + permissions tests (e.g. `failing-sync-application-cross-app-permission-retarget-on-update.integration-spec.ts`) increase coverage of the RBAC-guard surface and should pass clean.
- Migration dry-run: `npx nx database:reset twenty-server && npx nx run twenty-server:database:migrate:prod` — cherry-pick `07745947ee` touched migration files; verify ordering against shipped partner-os migrations.
- `npx nx run twenty-front:graphql:generate` — zero-diff check.

## Guardrail A — telemetry / egress scan — PASS

Scanned `git diff origin/main...HEAD` (18,335 lines, 134 files) for `twenty\.com`, `ENTERPRISE_VALIDITY_TOKEN`, `twentyhq`, `clickhouse`, `posthog`, `segment`, `mixpanel`, `amplitude`, `\.track\(`, `analytics\.(track|identify|page)`, `phone-home`, `verifyEnterprise`, `validateLicense`, `licenseValidity`. Also scanned `package.json` + `yarn.lock` for analytics-library deps.

**ADDED egress patterns:** none (0 telemetry imports, 0 new phone-home endpoints, 0 new analytics-SDK deps).

**REMOVED egress patterns (net cleanup):**

- `-https://twenty.com/images/lab/is-ai-enabled.png` — `IS_AI_ENABLED` lab image removed.
- `-https://github.com/twentyhq/core-team-issues/issues/{2223,2224,2225}` — doc-comment references removed from permission flag entities.

**ClickHouse guardrail replacement — verified OK.** The `IS_USAGE_ANALYTICS_ENABLED` removal flipped three ClickHouse query-gating sites from flag-gated to `isClickHouseConfigured`-gated (`client-config.service.ts:257` → `!!this.twentyConfigService.get('CLICKHOUSE_URL')`). Fuse's default Postgres-only install has `CLICKHOUSE_URL` unset → `isClickHouseConfigured=false` → all analytics queries short-circuit. This is the correct replacement semantic and does **not** create unconditional ClickHouse write paths.

**Verdict: PASS — CLEAN.**

## Guardrail B — partner-os surface diff — PASS

`git diff origin/main...HEAD -- packages/twenty-server/src/modules/partner-os/` returns **0 lines**. The `f6423f5925` skip successfully protected partner-os from the DataSourceModule cascade. No other applied commit touches partner-os paths.

**Verdict: PASS — 0 lines.**

## Guardrail C — feature-flag intentional drift — PASS

Unlike prior waves, feature-flag drift in 2D is EXPECTED (the wave is the flag changes). Verifier checks are:

1. **`IS_PARTNER_OS_ENABLED` present on final HEAD:** confirmed — `packages/twenty-shared/src/types/FeatureFlagKey.ts:16`.
2. **Flag diff matches executor report:** confirmed — 4 removed, 0 added:
   - `IS_AI_ENABLED` (removed via 30b8663a74)
   - `IS_DRAFT_EMAIL_ENABLED` (removed via 4f82c9a2d1)
   - `IS_USAGE_ANALYTICS_ENABLED` (removed via 10125c5e52)
   - `IS_RECORD_TABLE_WIDGET_ENABLED` (removed via 7e9947f8ec)
3. **Seed file parses cleanly:** re-read `seed-feature-flags.util.ts` — 60 lines, balanced braces, no trailing commas, no dangling references. Remaining seed entries: `IS_UNIQUE_INDEXES_ENABLED`, `IS_PUBLIC_DOMAIN_ENABLED`, `IS_EMAILING_DOMAIN_ENABLED`, `IS_JUNCTION_RELATIONS_ENABLED`, `IS_MARKETPLACE_SETTING_TAB_VISIBLE`, `IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED`, `IS_RECORD_PAGE_LAYOUT_GLOBAL_EDITION_ENABLED`.

**Verdict: PASS.**

## Removed-flag reference scan — PASS (with one WATCH nit)

Scanned all `.ts`/`.tsx` under `packages/` for remaining references to the 4 removed flags.

```
=== IS_DRAFT_EMAIL_ENABLED ===
packages/twenty-front/src/generated-metadata/graphql.ts:1708   # stale generated file
=== IS_USAGE_ANALYTICS_ENABLED ===
(none)
=== IS_RECORD_TABLE_WIDGET_ENABLED ===
(none)
=== IS_AI_ENABLED ===
(none)
```

**Partner-OS + onboarding hot-check:** `packages/twenty-server/src/modules/partner-os/` and `packages/twenty-server/src/engine/core-modules/onboarding/` contain **zero** references to any of the 4 removed flags. Fuse-authored code is clean.

**One WATCH nit (not a BLOCK):** `packages/twenty-front/src/generated-metadata/graphql.ts:1708` still lists `IS_DRAFT_EMAIL_ENABLED`. This file is auto-generated by `npx nx run twenty-front:graphql:generate --configuration=metadata`. The file is already flagged in the GraphQL codegen touches section above for a re-generate in CI. Expected to regenerate to zero-diff once CI runs codegen. No typecheck impact since this is the generated enum definition itself (not a reference from real code).

**Verdict: PASS — no Fuse-authored file requires an orchestrator surgical fix.**

## Deep file review — PASS

**Subsystem breakdown (134 files touched):**

| Subsystem | Files |
|---|---|
| `twenty-server/src/engine/**` (incl. role/, permission-flag/, object-permission/, field-permission/, application-manifest/) | 50 |
| `twenty-front/src/modules/**` (AI, settings/roles, record-read-only) | 39 |
| `twenty-server/src/modules/**` (workflow, workspace-member) | 11 |
| `twenty-server/test/integration/**` (permissions + workspace-members integration specs) | 10 |
| `twenty-sdk/src/cli/**` + `twenty-client-sdk/src/metadata/**` | 9 |
| `twenty-front/src/pages/**` | 4 |
| `twenty-shared/src/{types,application}/**` | 3 |
| `twenty-apps/examples/postcard/**` | 2 |
| `twenty-front/src/generated-metadata/**` (auto-gen) | 1 |
| `twenty-server/src/database/**` (permission-flag entity only, no new migration files) | 1 |
| `.github/workflows/ci-zapier.yaml` | 1 |
| `docs/ops-logs/**` (this log) | 1 |

**Priority deep-reads:**

1. **`07745947ee` — rolesPermissions cache cartesian-product fix.** Replaces a single 5-way LEFT JOIN (TypeORM eager relations on `role.objectPermissions`/`permissionFlags`/`fieldPermissions`/`rowLevelPermissionPredicates`/`rowLevelPermissionPredicateGroups`) with six parallel `Repository.find({ where: { workspaceId } })` queries + client-side `regroupEntitiesByRelatedEntityId` by `roleId`. The per-role permission-construction loop is semantically unchanged; every object/field-level `canRead`/`canUpdate`/`canSoftDelete`/`canDestroy` still comes from the same role-scoped collection. The new RLP-predicate `find` calls explicitly pass `deletedAt: IsNull()`, which is belt-and-suspenders against the existing `@DeleteDateColumn` default filter — **no behavior change**. Permission-flag-table `roleId` index added (new migration via a sibling workspace migration). **No auth bypass, no orphan role/resource pairs now allowed.** PASS.

2. **`921a0f01c8` — cross-app role retarget guard.** New `validateRoleBelongsToCallerApplication` is invoked from all three `flat-{object,field,permission-flag}-permission-validator.service.ts` update paths **before** the `isEditable` check. Wrapped with `buildOptions` parameter so the guard can be suppressed in trusted internal paths but is on by default for user-triggered migrations. Integration test `failing-sync-application-cross-app-permission-retarget-on-update.integration-spec.ts` (+216 LOC) covers the attack path. Error code `ROLE_BELONGS_TO_ANOTHER_APPLICATION` is properly wired through `permissions.exception.ts` and the GraphQL exception handler. **Guard correctly attached, test coverage present.** PASS.

3. **`30b8663a74` — IS_AI_ENABLED removal (31 files).** AI features now unconditional. Removed per-method `@RequireFeatureFlag(IS_AI_ENABLED)` from `agent.resolver.ts` (5 methods), `agent-chat.resolver.ts` (8 methods), `agent-chat-subscription.resolver.ts` (1 method), `role.resolver.ts` (2 methods: `assignRoleToAgent`, `removeRoleFromAgent`), and `workflow-version-step.resolver.ts` (inline feature-flag check on `WorkflowActionType.AI_AGENT` step creation). Class-level `@UseGuards(WorkspaceAuthGuard, SettingsPermissionGuard(AI))` retained everywhere. Fuse has no custom AI-gating logic — `grep -r "isAiEnabled\|IS_AI_ENABLED"` against `partner-os/` and `twenty-front/` returns empty. No leftover `if (isAiEnabled)` branches. **Safe.** PASS.

4. **`bc28e1557c` — updateWorkspaceMemberSettings introduction.** New mutation `UserResolver.updateWorkspaceMemberSettings` at `user.resolver.ts:443-445`. Wired with `@UseGuards(WorkspaceAuthGuard, CustomPermissionGuard)`. Self-update vs other-user check at lines 453-475. Fuse onboarding hook `onboardingService.completeOnboardingProfileStepIfNameProvided(...)` is **called at line 525** of the new resolver — executor preservation confirmed. Hook is ALSO still called from `workspace-member-update-one.pre-query.hook.ts:48` for the legacy `updateOne` path. Dual-path invocation means Fuse's "set your name → complete onboarding step" flow works via both old and new mutations. The `assertWorkspaceMemberUpdateUsesNonCustomFieldsOnly` util rejects custom fields on this settings-only endpoint, but partner-os does NOT extend `WorkspaceMemberWorkspaceEntity`, so there is no Fuse-specific custom field to block. **Onboarding flow intact.** PASS.

5. **Migration files.** No new `packages/twenty-server/src/database/typeorm/core/migrations/common/*.ts` files added in this wave — the executor's surgical deletion of `1-22-instance-command-fast-1775749486425-auto-generated.ts` is confirmed via `ls`. The only entity-file change is `permission-flag.entity.ts` (roleId index addition). No migrations drop partner-os tables. The rolesPermissions cache fix relies on a sibling workspace migration applied through the workspace-migration builder (not a core migration file) — no reversibility concerns at the core migration layer.

**Verdict: PASS.**

## V5 — RBAC guard integrity — PASS

Controllers/resolvers touched: 7 files.

```
packages/twenty-server/src/engine/core-modules/approved-access-domain/approved-access-domain.resolver.ts   # import reorder only
packages/twenty-server/src/engine/core-modules/usage/usage.resolver.ts                                    # added import, no guard change
packages/twenty-server/src/engine/core-modules/workflow/resolvers/workflow-version-step.resolver.ts       # removed inline isAiEnabled check, guards intact
packages/twenty-server/src/engine/metadata-modules/ai/ai-agent/agent.resolver.ts                          # FeatureFlagGuard removed, WorkspaceAuthGuard+SettingsPermissionGuard retained
packages/twenty-server/src/engine/metadata-modules/ai/ai-chat/resolvers/agent-chat-subscription.resolver.ts  # @RequireFeatureFlag removed, SettingsPermissionGuard retained
packages/twenty-server/src/engine/metadata-modules/ai/ai-chat/resolvers/agent-chat.resolver.ts            # FeatureFlagGuard removed, WorkspaceAuthGuard+SettingsPermissionGuard retained
packages/twenty-server/src/engine/metadata-modules/role/role.resolver.ts                                   # class-level WorkspaceAuthGuard+SettingsPermissionGuard(ROLES) retained
```

**Guard removals catalogued:**

| File | Removed | Retained | Assessment |
|---|---|---|---|
| `agent.resolver.ts` | `FeatureFlagGuard`, per-method `@RequireFeatureFlag(IS_AI_ENABLED)` (×5) | `WorkspaceAuthGuard`, `SettingsPermissionGuard(PermissionFlagType.AI)`, per-method `SettingsPermissionGuard(AI_SETTINGS)` for mutations | Expected — flag removal. No auth/permission weakening. |
| `agent-chat.resolver.ts` | `FeatureFlagGuard`, per-method `@RequireFeatureFlag(IS_AI_ENABLED)` (×8) | `WorkspaceAuthGuard`, `SettingsPermissionGuard(PermissionFlagType.AI)` | Expected — flag removal. No auth/permission weakening. |
| `agent-chat-subscription.resolver.ts` | `@RequireFeatureFlag(IS_AI_ENABLED)` on `onAgentChatEvent` | Class `@UseGuards(WorkspaceAuthGuard, UserAuthGuard)` + method `@UseGuards(SettingsPermissionGuard(AI))` | Expected. |
| `role.resolver.ts` | `@RequireFeatureFlag(IS_AI_ENABLED)` on `assignRoleToAgent`, `removeRoleFromAgent` | Class `@UseGuards(WorkspaceAuthGuard, SettingsPermissionGuard(ROLES))` | Expected. |
| `workflow-version-step.resolver.ts` | Inline `featureFlagService.isFeatureEnabled(IS_AI_ENABLED)` check on `AI_AGENT` step creation | Class-level guards unchanged | Expected. |
| `approved-access-domain.resolver.ts` | none | all | Import reshuffle only. |
| `usage.resolver.ts` | none | all | Import addition only. |

**Hot-check for critical guards** (`WorkspaceAuthGuard`, `UserAuthGuard`, `AdminPanelGuard`, `NoPermissionGuard`): **zero removals** across the full diff.

**Verdict: PASS — no auth/permission guard was weakened. All removals are legitimate feature-flag cleanup; core auth and RBAC guards retained everywhere.**

## L5 post-merge SPEC-002 backfill

This wave REMOVES flags; SPEC-002 backfill is about ADDs, so no backfill is queued for the removals. Expected state is that prod workspace `06e070b2-80eb-4097-8813-8d2ebe632108` still has stale rows for `IS_AI_ENABLED`/`IS_DRAFT_EMAIL_ENABLED`/`IS_USAGE_ANALYTICS_ENABLED`/`IS_RECORD_TABLE_WIDGET_ENABLED` in `core."featureFlag"`. These rows become orphans after the enum removal. A follow-up cleanup DELETE is desirable but **not a merge blocker** — TypeORM will ignore unknown enum values at read time and return them as-is, and no code path references the removed enum members post-merge.

## Known concerns for verifier

1. **Skip rate 31% (5 of 16)** sits at the prompt's BLOCKED threshold edge. The three massive refactors (b11/cee/d5a, total 938 files) were clear misclassifications — their FeatureFlagKey touches are incidental to architectural changes that belong in a dedicated sub-plan. The e8cb086b64 skip was justified by reverse-direction conflict against already-applied `08b041633a`. The f6423f5925 skip is a genuine partner-os protection (rule 2). All five skips have specific, citable reasons — none are silent failures.

2. **Massive-refactor commits may need re-triage.** b11f77df2a, cee4cf6452, and d5a7dec117 should likely be reclassified `defer` in the ledger (next wave), with a note that each requires a dedicated sub-plan rather than an inline cherry-pick. Recommend founder decision on these before the next sync wave.

3. **07745947ee amend provenance.** The cherry-pick was amended once (same step, to remove the duplicate migration file). The `-x` trailer linking to upstream SHA is preserved on the amended commit. This is the only amend in the wave.

4. **Migration ordering.** `07745947ee` and `921a0f01c8` touch migration files; verifier should dry-run `database:migrate:prod` against a fresh DB and confirm ordering vs partner-os migrations (`pkg/twenty-server/src/database/typeorm/core/migrations/common/`).

5. **Cross-app role retarget guard (921a0f01c8)** is a security-relevant add. Deep reviewer should read the new `failing-sync-application-cross-app-permission-retarget-on-update.integration-spec.ts` snapshot and confirm the guard fires on the intended attack surface (workspace member re-pointing a role at another application's permissions).
