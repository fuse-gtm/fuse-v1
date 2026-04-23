# SPEC-001: Upstream Cherry-Pick Plan

## Context

Fuse is forked from Twenty CRM v1.18.1 (branch `feat/partner-os-schema-spine`).

**Wave 1 complete (2026-03-20, merged as `4583bd0af7`).** Blocks 1–3 below have shipped.

**Wave 2 complete (2026-04-23).** Four sub-waves merged to main:
- 2A security (PR #15) — 18 of 23 security cherry-picks
- 2B backend (PR #17) — 227 of 231 + orchestrator P1 surgical fix for application-logs orphan
- 2C frontend (PR #20) — 125 of 126 + P1 re-fix for ApplicationLogsService recurrence from #19867
- 2D flags/RBAC (PR #22) — 11 of 16; 4 feature flags removed (`IS_DRAFT_EMAIL_ENABLED`, `IS_USAGE_ANALYTICS_ENABLED`, `IS_RECORD_TABLE_WIDGET_ENABLED`, `IS_AI_ENABLED`); `IS_PARTNER_OS_ENABLED` preserved

Totals: 381 of 396 cherry-picks applied (96.2%). Skip categories: "already landed" wave-1 duplicates (726), empty-after-conflict-resolve (5), massive upstream refactors deferred to future waves (7), partner-os dependency preservation (1), SDK-refactor-batch misclassified as security (4 from 2A). i18n-bulk (94 commits) skipped entirely per founder decision. Support PRs: #16 planning, #19 R1 Linaria fix, #21 2C watch items, #23 Apollo activation runbook.

See `docs/fuse-upstream-patch-ledger.md` for the closed-out ledger with new-SHA-on-main mappings, and `docs/ops-logs/2026-04-23-wave2-closeout.md` for the full-repo state report.

**Next wave base:** post-wave-2 main (whatever `origin/main` tip is at triage time for the next sync).

Root package version is `0.2.1` on both sides — no major version bump yet.

This spec defines which upstream commits to cherry-pick, in what order, and which
to explicitly skip. The goal is to take security fixes and the Linaria migration
without pulling in billing surveillance, feature flag removals, or half-baked
subsystems.

**For the current active backlog, see `docs/fuse-upstream-patch-ledger.md`.**
The sections below (Blocks 1–3) are the historical wave 1 plan, kept as reference.
The "DO NOT CHERRY-PICK" section below remains the living sovereignty charter
and governs all future waves.

## Fork Isolation Rule

All Fuse code lives in `packages/twenty-server/src/modules/partner-os/`.
Zero modifications to Twenty core or `twenty-ui` — except:
- `standard-navigation-menu-item.constant.ts` (sidebar reorder, intentional)
- Email/branding files (Twenty->Fuse text replacement, intentional)

Cherry-picks that touch Twenty core are acceptable if they are bug fixes or
security patches. Feature additions to Twenty core require explicit approval.

---

## Block 1: Security Fixes (P0) — **COMPLETE (wave 1, 2026-03-20)**

Execute these first. They are small, targeted, and independently cherry-pickable.
Order does not matter within this block.

| # | Commit | PR | Title | Risk if skipped |
|---|--------|----|-------|-----------------|
| 1 | `05c2da2d0f` | #18518 | SSRF IP validation + protocol allowlist | Authenticated users can reach internal network. Redis/Postgres on same EC2 box. Exploitable. |
| 2 | `6f4f7a1198` | #18857 | Security headers on file serving (stored XSS) | Uploaded HTML renders inline on origin. Trivial stored XSS. |
| 3 | `2c2f66b584` | #18665 | DOMPurify XSS vulnerability (dep bump) | 4 known Dependabot alerts. |
| 4 | `1a8be234de` | #18305 | OAuth hardening: PKCE binding, rate limiting, code hashing | Auth code injection if Google OAuth is enabled. |
| 5 | `0223975bbd` | #18318 | GitHub Actions injection fixes | CI workflow injection vectors. |
| 6 | `68d2297338` | #18316 | Cross-repo GH Actions expression injection | Same as above. |

### Execution steps

```bash
# For each commit, from the fork branch:
git cherry-pick <commit-sha> --no-commit
# Review the diff — verify no unrelated changes pulled in
git diff --cached --stat
# If clean, commit with attribution:
git commit -m "security: cherry-pick <title> from upstream (#<pr>)"
# If conflicts, resolve manually — security logic takes priority over formatting
```

### Conflict risk: LOW
These commits touch `SecureHttpClientService`, file-serving middleware, and
CI YAML. None overlap with partner-os code.

---

## Block 2: Linaria Migration (P1) — **COMPLETE (wave 1, 2026-03-20)**

This is the critical path for FUSE-206. It unblocks the theme pass (FUSE-502)
and the `WelcomeProTrialModal` component (which already uses `@linaria/react`
and `themeCssVariables`).

These 10 commits form one atomic unit. Cherry-picking `1db2a40961` alone will
break without the follow-ups. Treat as a single rebase block.

| # | Commit | PR | Title | Files |
|---|--------|----|-------|-------|
| 1 | `1db2a40961` | #18307 | Migrate twenty-ui to Linaria | 211 files, 3685+/3000- |
| 2 | `c4140f85df` | #18314 | Migrate small modules (PR 1/10) | |
| 3 | `802a5b0af6` | #18328 | Migrate auth, activities, AI, pages (PR 2-3/10) | |
| 4 | `3bfdc2c83f` | #18342 | Migrate command-menu, workflow, page-layout (PR 4-6/10) | |
| 5 | `7a2e397ad1` | #18361 | Complete Linaria migration | |
| 6 | `eda905f271` | #18382 | Improve Linaria pre-build speed | |
| 7 | `c41a8e2b23` | #18389 | Simplify theme system: static CSS variables | |
| 8 | `647c32ff3e` | #18402 | Deprecate runtime theme objects for CSS variables | |
| 9 | `dd58eb6814` | #18492 | Fix Linaria CSS regressions | |
| 10 | `045faf018a` | #18509 | Design fixes batch post-migration | |

### Execution strategy

Do NOT cherry-pick individually. Instead:

```bash
# Create a temporary branch from the Linaria start point
git checkout -b tmp/linaria-rebase 1db2a40961^

# Cherry-pick the full sequence
git cherry-pick 1db2a40961 c4140f85df 802a5b0af6 3bfdc2c83f \
  7a2e397ad1 eda905f271 c41a8e2b23 647c32ff3e dd58eb6814 045faf018a

# Merge into the main branch
git checkout feat/partner-os-schema-spine
git merge tmp/linaria-rebase --no-ff -m "feat: cherry-pick Linaria migration from upstream (#18307..#18509)"
```

### Conflict risk: HIGH
The branding changes (Fuse text replacements in email templates, FooterNote,
SignInUp) will conflict with PRs 2-3/10. Resolve by keeping Fuse branding text
but accepting the Emotion->Linaria style migration.

### Post-merge verification

```bash
npx nx build twenty-shared
npx nx build twenty-front
npx nx typecheck twenty-front
npx nx lint:diff-with-main twenty-front
```

### After Linaria lands

- Theme overrides go in a single CSS file (`fuse-overrides.css`) as `:root` variable overrides
- Pattern changes from `${({ theme }) => theme.font.color.primary}` to `${themeCssVariables.font.color.primary}`
- Spacing: `theme.spacing(4)` to `themeCssVariables.spacing[4]`
- See `docs/fuse-design-system-token-map.md` for Figma-to-Code mapping

---

## Block 3: Performance Fixes (P2) — **COMPLETE (wave 1, 2026-03-20)**

Backend-only, low conflict risk. High value on a t3.small instance.

| # | Commit | PR | Title |
|---|--------|----|-------|
| 1 | `c407341912` | #19068 | Multi-layer caching for hot DB queries (JWT auth path) |
| 2 | `1109b89cd7` | #19111 | Redis metadata version for GraphQL cache key |

```bash
git cherry-pick c407341912 1109b89cd7
```

### Conflict risk: LOW
These touch auth caching services and GraphQL response layer. No partner-os overlap.

---

## DO NOT CHERRY-PICK

### Billing for self-hosts (`c1da7be6d7` / #18075)

Enterprise licensing with phone-home mechanism. Server calls `twenty-website`
daily to verify `ENTERPRISE_VALIDITY_TOKEN`. If subscription lapses, enterprise
features (RLS, SSO, audit logs) get gated. Introduces dependency on Twenty's
servers being up. **Surveillance vector. Keep out.**

### Billing analytics (`77d4bd9158` / #18592)

ClickHouse-backed usage analytics. Writes billing events. We don't run
ClickHouse. Adds infrastructure surface area for zero value.

### Feature flag removals (`e8cb086b64`, `19074-19083`)

These delete the feature flag enum from `twenty-server` and move it to
`twenty-shared`. They also remove flags and upgrade commands for versions <= 1.18.
Since we're forked at 1.18.1, these removals would delete code paths we may
still be running on. **Do not take until a full rebase to 1.19+.**

### i18n/docs translations (~50 commits)

Noise. No runtime impact. Skip all.

### Website/SDK changes

`d246b16063` (new website), `37908114fc` (SDK extraction), `731e297147`
(SDK CLI OAuth) — none affect our runtime.

### RBAC/Permissions (15+ commits) — **RESOLVED in wave 2D (2026-04-23)**

The multi-user RBAC stack that didn't exist in v1.18.1 was merged as wave 2D
(PR #22) because the founder wants Apollo enrichment (SPEC-005), and the flag
+ permissions guards are its structural prerequisite. `IS_PARTNER_OS_ENABLED`
survived the enum cleanup. Three "massive refactor" 2D commits remain deferred
for a future wave focused specifically on them:
- `b11f77df2a` (#18319) — 349-file command-menu refactor
- `cee4cf6452` — 149-file ConnectedAccount metadata-schema migration
- `d5a7dec117` — 440-file ObjectMetadataItem rename

These are misclassifications (regex pulled them into 2D-flags-rbac via
incidental enum touches) rather than sovereignty rejects.

---

## Recurring Triage Footguns (learned during wave 2)

Future triage agents: when scanning a new backlog, watch for these patterns.

### ClickHouse / ApplicationLogs descendant chain

**Parent commit `36fbfca069` (#19486)** adds `application-logs` module with a
ClickHouse driver. It is on the permanent reject list (telemetry, infra surface
Fuse doesn't run). However, **follow-up commits that rename files, add billing
integration, or touch related config will keep re-importing `ApplicationLogsService`**
without realizing the parent is missing. Two separate examples hit wave 2:

- Wave 2B: commit `0ff04f6f4f` (#19600 config rename) + `3c57bc5ad5` (#19886
  billing integration) reintroduced the imports. Orchestrator applied a
  surgical fix: deleted the orphan `application-logs.module.ts` +
  `application-logs.module-factory.ts` + `interfaces/application-logs-module-options.type.ts`,
  kept `interfaces/application-log-driver.enum.ts` (used by
  `config-variables.ts`), stripped `ApplicationLogsService` imports +
  constructor injection + `writeLogs()` call from
  `logic-function-executor.service.ts`.
- Wave 2C: commit `af45adb5dc` (#19867 "Billing - fixes") re-added the same
  imports. Orchestrator re-applied the same strip pattern.

**Triage rule for future waves:** any commit touching `application-logs/`,
importing `ApplicationLogsService`, or mentioning `APPLICATION_LOG_DRIVER` in
its diff must be pre-reviewed against the rejected-parent list. Either flag as
conditional-on-follow-up-strip in the ledger verdict, or REJECT outright.
Watch for these symptom files reappearing:

- `packages/twenty-server/src/engine/core-modules/application-logs/application-logs.service.ts` — should NOT exist
- `packages/twenty-server/src/engine/core-modules/application-logs/application-logs.module.ts` — should NOT exist
- `packages/twenty-server/src/engine/core-modules/logic-function/logic-function-executor/logic-function-executor.service.ts` — should have the sovereignty comment, no `ApplicationLogsService` imports

Keep on-disk the sole intentional file `application-logs/interfaces/application-log-driver.enum.ts` (consumed by `twenty-config`).

### SDK refactor batches masquerading as security

Wave 2A skipped 4 commits that were regex-classified as `2A-security` because
they touched `.github/workflows/` or OAuth-adjacent files, but were actually
pieces of an upstream SDK refactor that requires many interdependent files to
land together. Future triage: a commit classified as security whose diff
includes file moves/deletions across `twenty-sdk/`, `twenty-client-sdk/`,
`upgrade-version-command/`, or `twenty-apps/` is almost always mis-classified.
Re-route to `2B-backend` or `defer` for a dedicated SDK-refactor wave.

### Admin-panel-deletion sovereignty direction

Fuse has deliberately deleted parts of the upstream admin panel (single-user
workspace scope). Wave 2A skipped `75848ff8ea` (70-file admin-panel migration)
because auto-resurrecting would undo Fuse deletions. Future triage: any commit
touching `packages/twenty-front/src/pages/settings/*` that includes UI for
multi-user workspace management, billing portal deep links, or enterprise
admin features needs explicit founder decision — keep-deleted / surgical-pick
/ reverse-direction. Don't auto-accept.

### GraphQL codegen freshness

Both 2B (227 cherry-picks) and 2C (125 cherry-picks) touched resolver/DTO files.
CI must run `npx nx run twenty-front:graphql:generate` and confirm zero diff on
every wave PR going forward; add it to the required-check list.

---

## Version and Flag Compatibility Notes

Upstream has moved the `FeatureFlagKey` enum from
`packages/twenty-server/src/engine/core-modules/feature-flag/enums/feature-flag-key.enum.ts`
to `packages/twenty-shared/src/types/FeatureFlagKey.ts`.

Our fork still has it in the old location with 25 keys (including our custom
`IS_PARTNER_OS_ENABLED`). The upstream version has 19 keys — several of ours
were removed (migration completion flags, `IS_APPLICATION_ENABLED`,
`IS_DASHBOARD_V2_ENABLED`, `IS_NAVIGATION_MENU_ITEM_ENABLED`, etc.).

**Rule: Do not take any commit that modifies the feature flag enum location
until a full rebase is planned.** See SPEC-002 for flag backfill details.
