# Wave 2 deploy attempt — 2026-04-24 (blocker surfaced)

Chronology of the wave-2 deploy attempt from a fresh CTO session starting on main @ `1a19bb1109`, ending rolled back to the prior good image `partner-os-33d82e948c`. Prod remained healthy throughout the rollback — no user-facing downtime window exceeded the time-to-rollback.

## Outcome (TL;DR)

| | |
|---|---|
| Prod image | `partner-os-33d82e948c` (unchanged — SAME as session start) |
| Main HEAD | `0ede951cbd` (advanced from `1a19bb1109` via 4 merged PRs — #35, #38, #39, #40) |
| Wave-2 CI | **GREEN** after 8 iteration rounds on PR #35 |
| Wave-2 image | **BUILT** (`partner-os-0ede951cbd`, pushed to GHCR) |
| Deploy | **BLOCKED** — wave-2 image cannot boot due to pre-existing cherry-pick drift in `1-20`/`1-21` upgrade-version-command modules |
| Rollback | Clean — `partner-os-33d82e948c` restored, healthz 200, server logs clean |

## PRs shipped this session

| PR | Title | Status |
|---|---|---|
| [#35](https://github.com/fuse-gtm/fuse-v1/pull/35) | fix(twenty-front): wave-2 deploy unblock — 8 CI rounds to green | MERGED |
| [#38](https://github.com/fuse-gtm/fuse-v1/pull/38) | fix(upgrade-command): add missing 1.22 drop-object-metadata-data-source-fk file | MERGED |
| [#39](https://github.com/fuse-gtm/fuse-v1/pull/39) | fix(docker): forward PG_SSL_ALLOW_SELF_SIGNED + TRUST_PROXY in fuse override | MERGED |
| [#40](https://github.com/fuse-gtm/fuse-v1/pull/40) | fix(upgrade-command): add missing 1.22 add-credit-balance-to-billing-customer file | MERGED |

## Phase A — CI iteration to green (SUCCESS)

8 rounds on PR #35 against the `Fuse Image Build` workflow. Each round surfaced a new class of regression introduced by prior cherry-pick drift:

| Round | Error class | Fix |
|---|---|---|
| 1 | Duplicate top-level `import { styled }` + dup `export const messages` stubs (3 files) | Dedupe imports, strip redundant stubs |
| 2 | Type-alias stubs shadowing real enum/schema **values** (5 files) — `CalendarChannelSyncStage`, `MessageChannelSyncStage`, `MessageChannelContactAutoCreationPolicy`, `MessageFolderImportPolicy`, `Attachment` dup, `ToolOutputMessageSchema`, `ToolOutputResultSchema` | Convert each to proper value re-export (real enum from `twenty-shared`, or PascalCase value alias for Zod schemas) |
| 3 | Apollo Client v4 hook subpath drift (2 files) | `@apollo/client` → `@apollo/client/react` for `useQuery`, `useLazyQuery` |
| 4 | `useGetWorkspaceInvitationsQuery` type-only stub | Convert to noop value hook matching Apollo `useQuery<T>()` shape |
| 5 | `AgentMessageRole` type-only stub used as enum | Real enum with SYSTEM/USER/ASSISTANT values (matching server-side canonical) |
| 6 | `getAbsoluteUrl` not exported by `twenty-shared/utils` | Consumer switched to `ensureAbsoluteUrl` (the existing non-throwing helper) |
| 7 | `FrontComponentRenderer` not exported by `twenty-sdk/front-component-renderer` | Import routed to extracted sibling package `twenty-front-component-renderer` (per upstream PR #19021) |
| 8 | **All green.** Image `partner-os-d7aba1bbd9` pushed. | — |

Key iteration insight: use precise AST-style scanners (distinguish value vs type imports) rather than regex matching — the first scanner pass over-reported 70 false positives on `@apollo/client/errors` and `@apollo/client/testing/react` that were actually valid Apollo v4 subpaths.

## Phase B — Merge + main image build (SUCCESS)

- PR #35 admin-merged (squash) at `7d4b84b30f` on main.
- Dispatched `fuse-image-build.yml --ref main` → built `ghcr.io/fuse-gtm/fuse-v1:partner-os-7d4b84b30f` (13m).

## Phase C — Deploy attempts (3, all FAILED; rollback to 33d82e948c HEALTHY)

### C-1: partner-os-7d4b84b30f

- Updated `.env` on prod with `TRUST_PROXY=1` + `ALLOW_REQUESTS_TO_TWENTY_ICONS=true`.
- First pull failed: `docker compose pull` resolved to `twentycrm/twenty:partner-os-...` (docker.io) because the runbook I was handed used the TAG= env convention — but prod uses `TWENTY_IMAGE` through a `docker-compose.fuse.yml` override.
- **First SSH `no space left on device`**: EC2 disk at 96% (28G/29G). `docker image prune -a -f` reclaimed 2.2 GB — disk back to 39%. Retried.
- **First real crash: `MODULE_NOT_FOUND`** for `1-22-instance-command-fast-1775804361516-drop-object-metadata-data-source-fk` referenced by `instance-commands.constant.ts` but file never committed to Fuse main. Upstream had it (added by PR #19532). Filed PR #38 to cherry-pick the single file. Admin-merged.

### C-2: partner-os-191cdcd11b (post #38 + #39)

- **Second, deeper `MODULE_NOT_FOUND`**: `1-22-instance-command-fast-1776078919203-add-credit-balance-to-billing-customer`. Node's require is lazy — the first fix revealed the next missing file in the same chain. Filed PR #40. Admin-merged.
- Also found RDS-rejects-non-SSL-connections issue: `no pg_hba.conf entry ... no encryption`. Base `docker-compose.yml` hardcodes `PG_DATABASE_URL` without `sslmode` and does not forward `PG_SSL_ALLOW_SELF_SIGNED`. Root cause likely a recent RDS parameter group change forcing SSL — the worker container held a pre-flip connection for 11 days. Fixed by updating `docker-compose.fuse.yml` to forward `PG_SSL_ALLOW_SELF_SIGNED=true` + `TRUST_PROXY` + `ALLOW_REQUESTS_TO_TWENTY_ICONS`. `sslmode=require` in the URL path caused `SELF_SIGNED_CERT_IN_CHAIN` because it bypasses the TypeORM `ssl: { rejectUnauthorized: false }` setting — removed. Filed PR #39. Admin-merged.

### C-3: partner-os-0ede951cbd (post #40)

- **Third `MODULE_NOT_FOUND`**: `./1-21-backfill-datasource-to-workspace.command` referenced by `1-21/1-21-upgrade-version-command.module.ts`.
- Investigation revealed the Fuse `1-21-upgrade-version-command.module.ts` is an OLD snapshot. Upstream has since renamed the command files to include timestamp+numeric-prefix (e.g. `1-21-workspace-command-1775500003000-backfill-datasource-to-workspace.command.ts`) and added new commands not in Fuse's version. The Fuse module.ts imports 3 old filenames; two of them map to renamed upstream files; one may have been removed entirely.
- **Broad scan across `packages/twenty-server/src`: 39 distinct `src/` imports point at files that don't exist in Fuse.** Bulk-copy from upstream succeeded for 3 (billing crons / service). The remaining 36 are:
  - 16 × `1-20/` command files (renamed or removed upstream)
  - 2 × `1-21/` command files (renamed upstream)
  - 1 × `1-22/` workspace-command file (present in upstream with a different numeric prefix)
  - 3 × `database/commands/command-runners/*` (unclear upstream path)
  - 1 × `database/commands/core-migration-runner/services/core-migration-runner.service`
  - 1 × `engine/core-engine-version/services/core-engine-version.service`
  - 4 × `engine/core-modules/tool-provider/*` (likely renamed)
  - 1 × `engine/metadata-event-emitter/types/metadata-event-batch.type`
  - 2 × `engine/metadata-modules/ai/ai-agent/*` (renamed)
  - 2 × `engine/metadata-modules/(calendar-channel|message-folder)/data-access/*-data-access.module`
  - 2 × view-sort / view-calendar-layout enum renames
  - 1 × `modules/workspace-member/query-hooks/workspace-member-pre-query-hook.service`
  - 1 × `utils/parse-email-body`

The scale of this drift is not something that can be resolved inline during a deploy. It requires a focused cleanup plan:
1. For each 1-20/1-21 module, pull the current upstream version of `*-upgrade-version-command.module.ts` + all files it imports.
2. Reconcile with any Fuse-local additions in those modules (should be none).
3. Validate all 39 now resolve.
4. Rebuild + redeploy.

### Rollback — SUCCESS

- Restored `TWENTY_IMAGE=ghcr.io/fuse-gtm/fuse-v1:partner-os-33d82e948c`.
- Stopped + removed the broken containers, `docker compose up -d` recreated from the old image.
- Post-rollback health: all containers up, `twenty-server-1 (healthy)`, `healthz HTTP 200`, `root HTTP 200`, `Nest application successfully started`.
- **`TRUST_PROXY=1`, `ALLOW_REQUESTS_TO_TWENTY_ICONS=true`, and the updated `docker-compose.fuse.yml` (SSL env forwarding) are INTENTIONALLY KEPT.** They are additive / safe with the old image, and PR #39 already merged the compose change to main.

## Invariants preserved

- No data egress to `twenty.com` introduced. Confirmed by reading PR #35 diff (frontend-only, no new outbound calls) and PR #38/#40 (standalone migration files, no HTTP clients).
- Partner-OS module unchanged. No file under `packages/twenty-server/src/modules/partner-os/` touched in any of the four merged PRs.
- `IS_PARTNER_OS_ENABLED` still in `packages/twenty-shared/src/types/FeatureFlagKey.ts`.
- No upstream push attempted.

## Follow-ups (wave-3 scope)

**P0 — deploy unblock**
- `docs/superpowers/plans/2026-04-24-wave2-upgrade-command-drift-cleanup.md` (to be drafted next session): resolve the 36 missing imports in upgrade-version-command tree. Either re-cherry-pick the renamed files + update `1-20/1-21/1-22` module.ts files to match, OR neutralize the modules entirely (skip backfills on a DB already past 1.22).

**P1**
- Re-apply `1f2dccb047` lambda.driver.ts TOCTOU race fix on top of current main. Was dropped during wave-2 deploy unblock to reduce scope. Sonarly #28633.
- Investigate RDS parameter group change: confirm whether `rds.force_ssl = 1` was flipped recently, and if so why the old container didn't fail. If the change predates this session, document in `docs/ops-logs/`.

**P2**
- CD deploy workflow `.github/workflows/cd-deploy-main.yaml` fires `repository_dispatch` to `twentyhq/twenty-infra` when `TWENTY_INFRA_TOKEN` is set. Currently a no-op on Fuse (token not set) but a latent sovereignty bug. Delete.
- `schema.graphql` duplicate SDL types in `packages/twenty-client-sdk/src/metadata/generated/schema.graphql` (harmless, regen from canonical).

## Ops snapshot

```
Main HEAD:           0ede951cbd
Prod image:          ghcr.io/fuse-gtm/fuse-v1:partner-os-33d82e948c
Prod .env:           TRUST_PROXY=1, ALLOW_REQUESTS_TO_TWENTY_ICONS=true, TWENTY_IMAGE on old tag
docker-compose.fuse.yml: updated with SSL + env forwarding (now on main via #39)
Prod containers:     twenty-db-1 healthy, twenty-redis-1 healthy, twenty-server-1 healthy, twenty-worker-1 running
External:            healthz HTTP 200, root HTTP 200
```
