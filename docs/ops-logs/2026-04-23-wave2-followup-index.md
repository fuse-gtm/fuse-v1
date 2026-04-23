# Wave 2 Followup Index — 2026-04-23

One-stop list of every open item surfaced during the wave-2 upstream sync
(waves 2A / 2B / 2C / 2D + preflight + baseline). Sorted by **priority**
(P0 → P2), cross-indexed by **owner** (user / agent / either).

Each row links to the source ops-log(s) for full context. Dedupe applied:
items cited in multiple logs collapse into one row. Items already resolved
(e.g. R1 fixed pre-2C, branding follow-ups merged in PR #21) are excluded.

Source logs abbreviated as:
- `baseline` = `2026-04-23-wave2-baseline.md`
- `preflight` = `2026-04-23-wave2-preflight-review.md`
- `2A` = `2026-04-23-wave2a-security-log.md`
- `2A-watch` = `2026-04-23-wave2a-watch-items.md`
- `2A-skip` = `2026-04-23-wave2a-skipped-followup.md`
- `2B` = `2026-04-23-wave2b-backend-log.md`
- `2C` = `2026-04-23-wave2c-frontend-log.md`
- `2D` = `2026-04-23-wave2d-flags-rbac-log.md`
- `branding` = `docs/fuse-branding-followups.md`
- `SPEC-002` = `docs/agent-specs/SPEC-002-feature-flag-backfill.md`
- `apollo` = `docs/superpowers/plans/2026-04-24-apollo-activation.md`

---

## P0 — must resolve before next deploy

| Item | Owner | Source | Action |
|---|---|---|---|
| **`yarn.lock` drift from wave 2D cherry-picks breaks CI on main.** `server-build`, `server-lint-typecheck`, `sdk-test (test:integration)`, `ui-task (test)` all FAIL on PR #22's merge commit with `YN0028: The lockfile would have been modified by this install, which is explicitly forbidden`. Only docs PR #23 merged after, which didn't re-run the full CI matrix — so current main looks "green-ish" but is actually red on every subsystem rerun. Root cause: upstream commit `291b876dda` ("Fix app design 6" #19827) rolled back 3 workspace package versions (create-twenty-app, twenty-client-sdk, twenty-sdk) from `2.0.0` → `1.23.0-canary.2` without regenerating yarn.lock; cherry-pick `e6b9a4c542` (@blocknote bump) may compound. 2D verifier missed this because the sandbox blocks `yarn install`. | user | closeout-audit CI matrix | Run `yarn install && git add yarn.lock && git commit -m "chore: regenerate yarn.lock post wave 2D" && git push origin main` from any dev machine with network access. Alternative: revert `291b876dda` + `e6b9a4c542` if the dep changes aren't wanted. **Must land before any prod deploy** — the Docker build on EC2 runs `yarn install --immutable` and will fail identically. |
| Verify `TRUST_PROXY=1` set on prod EC2 `.env` (host `i-05b90467e22fec9d2`) before exposing OAuth discovery endpoints externally. Host-header spoofing otherwise publishes attacker-controlled URLs via RFC 9728 metadata. | user | preflight, 2A §Deep review #2, 2A-watch W1, apollo pre-flight | SSH to prod, grep `.env` for `TRUST_PROXY`. If missing, append `TRUST_PROXY=1` and restart `twenty-server`. |
| `application-logs` module orphan — `application-logs.module.ts` + `application-logs.module-factory.ts` reference 6 missing files (service, constants, module-definition, 3 drivers). Blocks `nx typecheck twenty-server` in CI. Resolved by orchestrator per 2C log (pre-fix `51d308e099`), but verify post-merge that typecheck is green on main before any new deploy. | agent | 2B §P1 Build Blocker, 2C §Deep review | Re-run `npx nx typecheck twenty-server` against current `main`. If it fails, delete the two orphan `.module.ts` files, leave the 2 interface files. |

## P1 — must resolve before next sprint

| Item | Owner | Source | Action |
|---|---|---|---|
| Re-triage 3 wave-2D massive-refactor skips — `b11f77df2a` (#18319 conditionalAvailability, 349 files), `cee4cf6452` (#18784 ConnectedAccount metadata migration, 149 files), `d5a7dec117` (#18830 EnrichedObjectMetadataItem rename, 440 files). All misclassified as 2D flags/RBAC; each needs its own dedicated sub-plan, not inline cherry-picks. Reclassify to `defer` in `docs/fuse-upstream-patch-ledger.md`. | agent | 2D §Skipped, 2D §Known concerns #2 | Update ledger rows. Founder decides whether to open a Wave 2.5 mini-plan per commit or roll into wave 3 scope. |
| Clean stale feature-flag rows on prod workspace `06e070b2-80eb-4097-8813-8d2ebe632108`. Wave 2D removed 4 flags from enum (`IS_DRAFT_EMAIL_ENABLED`, `IS_USAGE_ANALYTICS_ENABLED`, `IS_RECORD_TABLE_WIDGET_ENABLED`, `IS_AI_ENABLED`). Prod DB still has these rows; orphaned but non-fatal. | user | 2D §L5 | Run DELETE against `core."featureFlag"` for the 4 removed keys scoped to the workspace. Safe — no enum reference can read them. |
| Run SPEC-002 backfill against prod workspace — insert `IS_JSON_FILTER_ENABLED`, `IS_PARTNER_OS_ENABLED` (and any other post-wave seed additions) for workspace `06e070b2-80eb-4097-8813-8d2ebe632108`. Required for Apollo activation step 2. (Note: SPEC-002 document references a pre-wave-2D flag set — reconcile against post-wave enum before running.) | user | preflight §Concern #4, SPEC-002, apollo §Step 2 | Reconcile SPEC-002 flag list against current enum at `packages/twenty-shared/src/types/FeatureFlagKey.ts`. Run the INSERT SQL. |
| Re-run `npx nx run twenty-front:graphql:generate` + `--configuration=metadata` on main post-wave. Waves 2B/2C/2D all touched GraphQL resolvers/DTOs; generated `graphql.ts` may be stale. Zero-diff assertion was deferred to CI but never confirmed locally on merged main. | agent | 2B §Verification, 2C §GraphQL codegen touches, 2D §GraphQL codegen touches | Checkout main, run both codegen commands, commit any diff. |
| `permissions.service.ts` — upstream removed the "retry once with cache invalidation" branch on API-key role lookup. Monitor Sentry / server logs for elevated `API_KEY_ROLE_NOT_FOUND` errors post-deploy. If elevated, consider re-adding the retry. | user | 2B §Auth/permissions spot-check | Add log filter; review for 48h post-deploy. |
| Deploy runbook update for 1-21 upgrade-command fan-out. First `npx nx run twenty-server:command -- upgrade` on post-wave-2B Fuse will walk the full 1.21→1.22→1.23→2.0 catalog. The `1-21/*` fast/workspace commands will execute on any workspace with cursor below 1.21 (all Fuse workspaces are in this state — forked at 1.18.1). | user | 2B §V5 Version collision, 2B §Migrations reviewed | Add "Upgrade-command fan-out" section to SPEC-004 deploy runbook before first post-wave-2B deploy. |
| Out-of-order migration `1774005903909-add-messaging-infrastructure-metadata-entities.ts` — timestamp earlier than existing `1774100000000-drop-workspace-ai-columns.ts`. TypeORM tracks by name so benign, but document in deploy runbook. | user | 2B §Migrations reviewed #1 | Note in SPEC-004. |
| Missing `migrations` table rows for deleted upstream migrations `AddViewFieldGroupIdIndexOnViewField1775129420309`, `MigrateMessagingCalendarToCore1775165049548`, `AddEmailThreadWidgetType1775200000000`. Fuse DB has these rows applied; upstream expects self-host operators to manually inject them for the deleted file. | user | 2B §Auth spot-checks, 2B §Migrations | Per upstream PR #19501 release notes, verify `core."migrations"` on prod DB; inject rows if missing. |
| Verify `EXA_WEBHOOK_SECRET` is set in production environment. If absent, webhook signature check is silently skipped and any caller can trigger candidate ingestion. | user | preflight §exa-webhook controller | SSH prod, grep `.env` for `EXA_WEBHOOK_SECRET`. Rotate + set if missing. |

## P2 — backlog, low priority

| Item | Owner | Source | Action |
|---|---|---|---|
| Branding nit — `getCustomApplicationDescription.ts` + `getStandardApplicationDescription.ts` contain user-visible markdown linking to `twenty.com/developers/extend/apps/...` and `create-twenty-app` CLI. Rewrite to `docs.fusegtm.com` + drop CLI line. | agent | 2C §Top concerns #1+#3, branding | Edit both utils; replace upstream URLs. |
| Branding nit — dev-seeder `get-page-layout-widget-data-seeds.util.ts:620` embeds `star-history.com/?repos=twentyhq%2Ftwenty`. Dev-seed only, not runtime. Rewrite to `fuse-gtm%2Ffuse-v1` or drop widget. | agent | 2C §Top concerns #2, branding | One-line edit. |
| Replace placeholder logo SVGs with approved brand assets (`fuse-logo.svg`, `fuse-logo-dark.svg`, `fuse-favicon.svg`). | user | branding §Assets | Design handoff; drop files into `packages/twenty-front/public/images/`. |
| Add `fuse-social-card.png` (1200x630) for OpenGraph/Twitter previews. | user | branding §Assets | Design handoff. |
| Replace legacy Android/iOS PWA icon PNGs. | user | branding §Assets | Design handoff. |
| `useAuth.ts` now mirrors `tokenPair` into a `secure`+`sameSite:lax` cookie on same origin (via upstream #19867). Fuse-controlled host, not a regression. Add a line to deploy runbook explaining the cookie for awareness. | agent | 2C §Deep review (auth), branding §auth-cookie note | One-line note in SPEC-004. |
| Push `fuse-docs` to GitHub + deploy to Vercel at `docs.fusegtm.com`. Repo lives locally at `~/fuse-docs`. | user | branding §Documentation | Create `fusegtm/fuse-docs` repo, push, assign custom domain. |
| Activate legal pages (Privacy + Terms) in Framer at `fusegtm.com/legal/{terms,privacy}`. Pages exist in template, need to be re-enabled. | user | branding §Documentation | Framer dashboard click. |
| Verify stubbed doc redirects live in production after deploy (`/user-guide/introduction` → `/docs/user-guide/introduction`, etc.). | user | branding §Documentation | Curl check post-deploy. |
| Test `fuse-docs` locally (`pnpm install && pnpm dev`) before Vercel deploy. | user | branding §Documentation | Local dev run. |
| Partner-customer-map-handoff listener is dead code — every invocation throws inside `GlobalWorkspaceDataSource.query()` without `shouldBypassPermissionChecks: true` and gets swallowed by the try/catch. Listener never executes. Tracked for eventual deletion or fix. | agent | preflight §Concern #2 (decision: dead code, no action) | Open partner-os backlog ticket; decide whether to fix or delete. |
| `partner-os-metadata-bootstrap.service.ts` cache thrashing — calls `getFreshFlatMaps()` after every object/field/relation creation (up to 136+ cache invalidations per bootstrap). Pre-existing concern from prior internal review; not wave-2 regression. | agent | preflight §HIGH-RISK row 3 | Re-batch `getFreshFlatMaps()` calls outside the nested loops. |
| Listener `partner-customer-map-handoff.listener.ts` raw SQL without workspace schema prefix — moot today because code is dead, but if resurrected the SQL isolation bug returns. | agent | preflight §Concern #3 | Address when listener is revived. |

## Carried to wave 3

| Item | Owner | Source | Context |
|---|---|---|---|
| Apollo enrichment activation — entire 7-step runbook. Requires prod SSH, OAuth setup at Apollo.io, admin-UI clicks. | user | apollo | Full runbook at `docs/superpowers/plans/2026-04-24-apollo-activation.md`. Prereq: wave 2 merged + deployed. |
| SDK-refactor batch — `4ea2e32366` (#18544 SDK CLI provisioning refactor) + dependents `c26c0b9d71` (#19563 OAuth creds for CoreApiClient) + `baf2fc4cc9` (#19583 SDK e2e DB readiness). 30+ file conflicts including dir renames (`twenty-apps/hello-world` → `examples/hello-world`). Items 2–3 cannot apply without parent. | either | 2A §Skip analysis, 2A-skip items 1–3 | Re-triage to `2B-backend` or its own sub-wave with dedicated conflict mapping. Check whether Fuse consumers depend on new SDK layout before committing effort. |
| Apply SPEC-002 seed-file change — three INSERTs (`IS_JSON_FILTER_ENABLED`, `IS_DRAFT_EMAIL_ENABLED` [now removed by 2D], `IS_PARTNER_OS_ENABLED`). Needs reconciliation against wave-2D post-state before applying. | agent | SPEC-002 §Step 1 | Edit `seed-feature-flags.util.ts`. Note: `IS_DRAFT_EMAIL_ENABLED` was removed by wave 2D — SPEC-002 is stale on that entry. |
| Marketplace API-key auth reduction (upstream #19409) — `UserAuthGuard` removed from `installMarketplaceApp`. No risk today (Fuse doesn't expose marketplace). Revisit if Fuse ever ships marketplace UI or issues workspace-scoped API keys to external partners. | agent | 2A §Deep review #5, 2A-watch W2 | Tracking only. |
| Partner-OS to Apollo provider migration (SPEC-005 Path 2) — add `ApolloEnrichmentProvider` to `partner-discovery-adapter.service.ts` alongside Exa. | agent | apollo §Step 7 | Scope as separate engineering task after Apollo Path 1 stable. |

## Decisions pending from founder

| Question | Context | Source |
|---|---|---|
| Admin-panel direction — upstream `75848ff8ea` (#19852, 70 files / 4700 lines) migrates admin panel to dedicated `/admin-panel` GraphQL endpoint. Fuse has deliberately deleted multiple admin-panel UI files (`SettingsAdminApplicationRegistrationDetail.tsx`, `SettingsAdminUserDetail.tsx`, `SettingsAdminWorkspaceChatThread.tsx`, `SettingsAdminWorkspaceDetail.tsx`, `SettingsAdminChatThreadMessageList.tsx`). Three outcomes: (a) keep skipped, Fuse intentionally stripped admin panel; (b) cherry-pick selectively (endpoint migration only); (c) reverse direction — accept upstream admin panel wholesale + re-decide what to strip. Pile of future conflicts grows until decided. | 2A §Skip analysis #4, 2A-skip item 4 |
| SDK-refactor batch decision — accept, defer, or permanently skip? The SDK move is organizational, not functional. Future upstream SDK commits pile conflicts until resolved. | 2A-skip item 1 |
| Concern #1 resolution revisit — `enterprise-plan.service.ts` still has 3 live outbound HTTP methods (`getSubscriptionStatus`, `getPortalUrl`, `getCheckoutUrl`) calling `ENTERPRISE_API_URL` (default `twenty.com/api/enterprise`). Decided ACCEPTED AS-IS on 2026-04-23. Future consideration: Option B (5s `AbortController` timeouts) if twenty.com uptime becomes a visible admin-panel issue. | preflight §Decisions Concern #1 |
| Marketplace-UI direction — if Fuse ever surfaces marketplace to external operators, revisit `UserAuthGuard` reinstatement on `installMarketplaceApp` resolver. Tracking only today. | 2A-watch W2, 2A §Deep review #5 |

---

## Counts

- P0: 2
- P1: 8
- P2: 13
- Carried to wave 3: 5
- Decisions pending: 4

**Total: 32 open items.**
