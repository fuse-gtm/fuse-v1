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

## Guardrail A — telemetry scan

**TODO: verifier agent.** Grep `git diff origin/main...HEAD` for `twenty\.com`, `ENTERPRISE_VALIDITY_TOKEN`, `twentyhq`, `clickhouse`, `posthog`, `segment`, `\.track\(`, `analytics\.`. Confirm CLEAN or list matches.

## Guardrail B — partner-os surface diff

**TODO: verifier agent.** Expected: `git diff origin/main...HEAD -- packages/twenty-server/src/modules/partner-os/` returns 0 lines. The `f6423f5925` skip protects partner-os from the DataSourceModule cascade; no other applied commit touches partner-os.

## Guardrail C — feature-flag seed drift

**TODO: verifier agent.** Verify:

- `packages/twenty-shared/src/types/FeatureFlagKey.ts` exists (enum still lives in twenty-shared).
- `IS_PARTNER_OS_ENABLED` present (grep confirmed PRESENT in this log — reconfirm).
- Prod workspace `06e070b2-80eb-4097-8813-8d2ebe632108` drift vs seed file: any NEW enum entries not present in `core."featureFlag"` rows require post-merge SPEC-002 backfill.

## Deep file review

**TODO: verifier agent.** Touched file list enumeration, per-file read + `get-code-context-exa` against upstream PRs, blocker/nit/accept classification. Priority files:

- `packages/twenty-server/src/engine/metadata-modules/role/services/workspace-roles-permissions-cache.service.ts` (07745947ee cartesian-product fix — changes query shape, deep-verify no auth bypass)
- `packages/twenty-server/src/engine/workspace-manager/workspace-migration/workspace-migration-builder/validators/utils/validate-role-belongs-to-caller-application.util.ts` (bb464b2ffb new guard — confirm not weakening existing `validate-*` utils)
- `packages/twenty-server/src/engine/core-modules/user/utils/assert-workspace-member-update-non-custom-fields.util.ts` (bc28e1557c new — confirm permission check semantics match the old inline branch)
- `packages/twenty-server/src/engine/metadata-modules/permissions/**` (wave 2D scope — any change here must be inspected for auth-guard weakening)

## L5 post-merge SPEC-002 backfill

**TODO: verifier agent.** If any flag is newly-seeded on post-wave main but absent on prod workspace `06e070b2-80eb-4097-8813-8d2ebe632108`, queue SPEC-002 backfill. (This wave REMOVES flags; backfill is about ADDs. The expected state is that prod workspace has the removed flags still present as stale rows — these can be cleaned up in a follow-up DELETE, not a blocker.)

## Known concerns for verifier

1. **Skip rate 31% (5 of 16)** sits at the prompt's BLOCKED threshold edge. The three massive refactors (b11/cee/d5a, total 938 files) were clear misclassifications — their FeatureFlagKey touches are incidental to architectural changes that belong in a dedicated sub-plan. The e8cb086b64 skip was justified by reverse-direction conflict against already-applied `08b041633a`. The f6423f5925 skip is a genuine partner-os protection (rule 2). All five skips have specific, citable reasons — none are silent failures.

2. **Massive-refactor commits may need re-triage.** b11f77df2a, cee4cf6452, and d5a7dec117 should likely be reclassified `defer` in the ledger (next wave), with a note that each requires a dedicated sub-plan rather than an inline cherry-pick. Recommend founder decision on these before the next sync wave.

3. **07745947ee amend provenance.** The cherry-pick was amended once (same step, to remove the duplicate migration file). The `-x` trailer linking to upstream SHA is preserved on the amended commit. This is the only amend in the wave.

4. **Migration ordering.** `07745947ee` and `921a0f01c8` touch migration files; verifier should dry-run `database:migrate:prod` against a fresh DB and confirm ordering vs partner-os migrations (`pkg/twenty-server/src/database/typeorm/core/migrations/common/`).

5. **Cross-app role retarget guard (921a0f01c8)** is a security-relevant add. Deep reviewer should read the new `failing-sync-application-cross-app-permission-retarget-on-update.integration-spec.ts` snapshot and confirm the guard fires on the intended attack surface (workspace member re-pointing a role at another application's permissions).
