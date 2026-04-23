# Wave 2B Backend Cherry-pick Log — 2026-04-23

Branch: `integration/upstream-wave2-backend`
Base: `18c6ffb35e28983e4dbf1d44fa611ce76430f84c` (post-2A main, commit `18c6ffb35e`)
Ledger: `docs/fuse-upstream-patch-ledger.md` (rows where Wave = `2B-backend`)

## Summary

- Cherry-picks attempted: 231
- Cherry-picks successful: 227
- Cherry-picks skipped: 4
- Conflicts auto-resolved (via rules 4-7): 55

## Skipped cherry-picks

All 4 skips were empty commits — the upstream SHA was a rollup whose content had already arrived via a prior cherry-pick in the same wave. No sovereignty-protected paths were conflicted.

| SHA | Reason | Rule |
|---|---|---|
| `b86e6189c0` | empty-commit-already-applied (Remove position from Timeline Activities + fix workflow title placeholder #18777) | empty-commit |
| `d389a4341d` | empty-commit-already-applied (Vertical bar charts data range fix #18748) | empty-commit |
| `9d613dc19d` | empty-commit-already-applied (Improve helm chart + linting + Redis externalSecret #18157) | empty-commit |
| `34ab72c460` | empty-commit-already-applied (Fix duplicate workflow agent node names #19015) | empty-commit |

No skips under enterprise-module-conflict, partner-os-conflict, or feature-flag-boundary rules.

## Conflicts resolved (branded / logic)

Full per-file log: `/tmp/wave2b-conflict.log` (55 cherry-picks involved conflict resolution, 0 branded-file preservations).

No branded frontend files (SignInUp.tsx, FooterNote.tsx, NotFound.tsx, SyncEmails.tsx, SettingsAIPrompts.tsx, getTimelineActivityAuthorFullName.ts, manifest.json) were encountered in this wave — expected, since wave 2B is backend-scoped.

Conflicts in cherry-picks 2B resolved by favoring upstream (`--theirs`) per rules 5-7:
- Migrations / core.datasource / upgrade-command files (multiple commits)
- GraphQL resolvers, DTOs, generated-metadata
- Workflow version-step, workspace-iterator, credit-cap gating
- Backend logic-vs-logic where Fuse had no divergent edit

## Schema surface deltas

- Migrations added: **-1** (183 → 182). Four upstream migrations were intentionally removed by "Prepare 1.21 (#19501)" and "chore: remove registeredCoreMigration (#19376)" as upstream consolidation; three new migrations replace them. Net: -1. This matches upstream's 1.21 release state.
  - Removed: `1773945207801-add-messaging-infrastructure-metadata-entities.ts`, `1775129420309-add-view-field-group-id-index-on-view-field.ts`, `1775165049548-migrate-messaging-calendar-to-core.ts`, `1775200000000-addEmailThreadWidgetType.ts`
  - Added: `1774005903909-add-messaging-infrastructure-metadata-entities.ts` (renamed from 1773945207801 — upstream fix to restore original timestamp), `1775649426693-add-error-message-to-upgrade-migration.ts`, `1775909335324-add-is-initial-to-upgrade-migration.ts`
- Most recent migration pre: `1775553825848-add-workspace-id-to-upgrade-migration.ts`
- Most recent migration post: `1775909335324-add-is-initial-to-upgrade-migration.ts`
- **Out-of-order NEW migrations: `1774005903909-add-messaging-infrastructure-metadata-entities.ts`** (timestamp 1774005903909 is lower than the pre-wave last-applied 1775553825848). TypeORM tracks applied migrations individually so this will still run on new installs; flagged here because the upstream authors themselves noted "restore original migration timestamp" in #18810.
- Entity files added: 0 (no `.entity.ts` net change)
- GraphQL schema / resolver / DTO touches: **39 files** (see `/tmp/wave2b-graphql-touches.txt`)

## Verification status

Deferred to CI (sandbox network-restricted; local lint/typecheck/test/migration-dry-run not runnable).

Required CI checks on the PR:
- `NODE_OPTIONS="--max-old-space-size=8192" npx nx lint:diff-with-main twenty-server`
- `npx nx typecheck twenty-server`
- `npx nx test twenty-server`
- `npx nx run twenty-server:test:integration:with-db-reset`
- `npx nx database:reset twenty-server && npx nx run twenty-server:database:migrate:prod` (migration dry-run on scratch DB — validates the out-of-order migration above)
- `npx nx run twenty-front:graphql:generate` — must produce zero diff (39 GraphQL-touching files)

## Guardrail checkpoint placeholders

## Guardrail A — telemetry scan (post-wave-2B)
TODO: scanner agent

## Guardrail B — partner-os surface
TODO: scanner agent

## Guardrail C — feature-flag drift
TODO: scanner agent

## Deep file review
TODO: deep-reviewer agent
