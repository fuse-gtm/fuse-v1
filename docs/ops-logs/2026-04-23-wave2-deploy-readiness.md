# Wave 2 Deploy Readiness Brief — 2026-04-23

**Target:** Fuse prod EC2 `i-05b90467e22fec9d2` (`app.fusegtm.com`) currently runs a pre-wave-2 image. This brief is the pre-flight checklist for the next deploy.

**Scope:** consolidates action items + change summary for the deploy operator (user). Deploy execution follows **SPEC-004 Deploy Runbook** — this brief precedes it.

## What changed since last prod deploy

**425 commits added to `main`** between `4583bd0af7` (wave 1 merge) and the current HEAD. Broken down:

| Source | Commits |
|---|---:|
| Wave 2A security cherry-picks | 18 |
| Wave 2B backend cherry-picks | 227 |
| Wave 2C frontend cherry-picks | 125 |
| Wave 2D flags/RBAC cherry-picks | 11 |
| Fuse-authored fixes (R1 + 2 P1s) | 3 |
| Fuse-authored docs (ledger/plans/ops-logs) | ~41 |

**Net behavioral changes on prod:**
- OAuth hardening (PKCE binding, RFC 9207 metadata, host-aware MCP auth guard)
- SSRF/XSS hardening (SecureHttpClientService, file-serving headers, DOMPurify bump)
- RBAC stack landed (roles, object-permission, field-permission, permission-flag, application-manifest guards)
- Cross-app role-retarget guard (prevents permissions escalation via app swap)
- Major perf: rolesPermissions cache cartesian-product fix (62k → 162 rows)
- 4 feature flags removed (`IS_DRAFT_EMAIL_ENABLED`, `IS_USAGE_ANALYTICS_ENABLED`, `IS_RECORD_TABLE_WIDGET_ENABLED`, `IS_AI_ENABLED`) — AI features now unconditional
- `updateWorkspaceMemberSettings` new resolver (Fuse onboarding hook preserved)
- useAuth mirrors `tokenPair` into `secure`+`sameSite:lax` cookie on same origin (not a regression on Fuse-controlled host)

## Action items BEFORE deploy (user)

### P0 — must complete

- [ ] **Set `TRUST_PROXY=1` on prod `.env`** — wave 2A added OAuth discovery controller (`oauth-discovery.controller.ts`) that derives issuer URL from `request.get('host')`. Behind Caddy, Host header is spoofable without this. Run:

  ```bash
  ssh ec2-user@52.20.136.71
  cd /path/to/packages/twenty-docker
  grep -q "^TRUST_PROXY=" .env || echo "TRUST_PROXY=1" >> .env
  # verify
  grep TRUST_PROXY .env
  ```

  `.env.fuse-prod.example` has it set as the default for future installs; existing prod needs manual append.

- [ ] **Confirm partner-os is still enabled on prod workspace.** Via Postgres MCP or SSH to DB:

  ```sql
  SELECT "key", "value" FROM core."featureFlag"
  WHERE "workspaceId" = '06e070b2-80eb-4097-8813-8d2ebe632108'
    AND "key" = 'IS_PARTNER_OS_ENABLED';
  ```
  Expected: one row, `value = true`. If missing, run SPEC-002 backfill SQL (reconciled for post-wave-2 enum).

### P1 — strongly recommended

- [ ] **Confirm CI passed on the wave 2 merge commits.** Each sub-PR (#15/#17/#20/#22) was merged via admin override due to pre-existing R1 typecheck failure. R1 is fixed on main (PR #19), but verify CI is now green on main HEAD before deploy:

  ```bash
  gh run list --repo fuse-gtm/fuse-v1 --branch main --limit 5
  ```

  Look for `front-task (typecheck)` and `server-task (typecheck)` success on the latest main commit. If still failing, investigate before deploy.

- [ ] **Cleanup stale feature-flag rows** (optional, non-blocking). Orphan rows for the 4 removed flags are tolerated by TypeORM but worth cleaning:

  ```sql
  DELETE FROM core."featureFlag"
  WHERE "key" IN ('IS_DRAFT_EMAIL_ENABLED', 'IS_USAGE_ANALYTICS_ENABLED',
                  'IS_RECORD_TABLE_WIDGET_ENABLED', 'IS_AI_ENABLED');
  ```

## Migrations to run on deploy

7 new migrations since wave 1. All are in `packages/twenty-server/src/database/typeorm/core/migrations/common/`:

| Migration | Source wave |
|---|---|
| `1774005903909-add-messaging-infrastructure-metadata-entities.ts` | 2B (out-of-order timestamp per #18810, benign per TypeORM semantics) |
| `1775129420309-add-view-field-group-id-index-on-view-field.ts` | 2B |
| `1775165049548-migrate-messaging-calendar-to-core.ts` | 2B |
| `1775200000000-addEmailThreadWidgetType.ts` | 2B (deletion in 2B reintroduced — check ops log) |
| `1775649426693-add-error-message-to-upgrade-migration.ts` | 2B |
| `1775654781000-addConditionalAvailabilityExpressionToPageLayoutWidget.ts` | 2B |
| `1775909335324-add-is-initial-to-upgrade-migration.ts` | 2D |

**Migration dry-run strongly recommended** on a scratch DB copy before prod:

```bash
# On a scratch DB copy:
npx nx database:reset twenty-server
npx nx run twenty-server:database:migrate:prod
# Verify no errors, all 7 migrations reported as applied.
```

## Deploy process

Follow **SPEC-004 Deploy Runbook** end-to-end. Key steps summarized:

1. Build new image: `IMAGE_TAG=partner-os-$(git rev-parse --short HEAD)` and push to GHCR.
2. SSH to prod, `docker compose pull` + `docker compose up -d`.
3. Watch logs for 5 minutes: `docker compose logs -f --tail=100 twenty-server`.
4. Verify `/api/version` returns the new SHA.

## Post-deploy validation

- [ ] Sign-in works (use pre-filled "Continue with Email" test creds)
- [ ] Partner-OS dashboard loads and shows expected partner records
- [ ] Admin → Settings → Roles screen renders (wave 2D RBAC surface)
- [ ] Admin → Settings → Enterprise page loads without hanging (confirms `TRUST_PROXY` effective for billing admin UX)
- [ ] `docker compose logs twenty-server --since=30m | grep -iE "ClickHouse|ApplicationLogs"` returns NOTHING (sovereignty invariant held)
- [ ] `docker compose logs twenty-server --since=30m | grep "twenty.com"` returns ONLY the known-accepted admin-UI enterprise fetches (status/portal/checkout)
- [ ] 60-minute soak: no 500s, no worker restarts, memory stable under 70% RSS on t3.small

## Rollback plan

If any validation step fails:

```bash
# On prod:
docker compose down
# Deploy previous image (tag = previous partner-os-<sha>):
export TWENTY_IMAGE=ghcr.io/fuse-gtm/fuse-v1:partner-os-<prev-sha>
docker compose up -d

# Revert migrations (if any completed on this deploy):
npx nx run twenty-server:typeorm migration:revert -d src/database/typeorm/core/core.datasource.ts
# Repeat for each forward migration applied.
```

If rollback is needed, open an ops-log entry at `docs/ops-logs/YYYY-MM-DD-wave2-deploy-rollback.md` capturing:
- Which validation step failed
- Log excerpts
- Image tag of the rollback target
- Whether the issue is on main (needs fix-PR) or specific to deploy (needs runbook update)

## After successful deploy

- [ ] Follow up on `docs/ops-logs/2026-04-23-wave2-followup-index.md` P1 items this sprint
- [ ] **Apollo activation** per `docs/superpowers/plans/2026-04-24-apollo-activation.md` if founder wants enrichment live
- [ ] Announce wave 2 complete internally (or note it in whatever channel tracks prod changes)

## Known non-blocking concerns

Captured in `docs/ops-logs/2026-04-23-wave2-followup-index.md` (P2 + carried-to-wave-3):
- Enterprise admin-UI billing calls still go to `twenty.com` — CTO-accepted, not a new risk
- 3 massive upstream refactors (command-menu, ConnectedAccount migration, ObjectMetadataItem rename) deferred to a future wave
- SDK refactor batch (4 commits from 2A skip) deferred — needs CTO direction on SDK-CLI tooling
- Admin panel deletion direction — CTO decision carried; current Fuse admin panel remains deleted for single-user-workspace scope
- auto-generated `graphql.ts` stale references to removed flags — regenerates on CI codegen; merge CI run should produce the fresh artifact
