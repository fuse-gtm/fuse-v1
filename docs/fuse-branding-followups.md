# Fuse Branding Follow-ups

Created: 2026-03-04
Scope: remaining branding debt after `rebrand: replace all Twenty branding with Fuse across frontend and server`.

## Assets

- [ ] Replace placeholder logo SVGs with final approved brand assets:
  - `packages/twenty-front/public/images/integrations/fuse-logo.svg`
  - `packages/twenty-front/public/images/integrations/fuse-logo-dark.svg`
  - `packages/twenty-front/public/images/icons/fuse-favicon.svg`
- [ ] Add `packages/twenty-front/public/images/fuse-social-card.png` (1200x630) for OpenGraph/Twitter previews.
- [ ] Replace legacy Android/iOS PWA icon PNGs in `packages/twenty-front/public/images/icons/`.

## Remaining User-Facing Strings To Review

- [x] `packages/twenty-front/src/pages/auth/SignInUp.tsx` — `Welcome to Fuse` ✅ (2026-03-05)
- [x] `packages/twenty-front/src/pages/not-found/NotFound.tsx` — `Page Not Found | Fuse` ✅ (2026-03-05)
- [x] `packages/twenty-front/src/pages/onboarding/SyncEmails.tsx` — `with Fuse` ✅ (2026-03-05)
- [x] `packages/twenty-front/src/pages/settings/ai/SettingsAiPrompts.tsx` — `managed by Fuse` ✅ (2026-03-05; renamed from `SettingsAIPrompts.tsx` by upstream #19837 "AI → Ai PascalCase refactor" in wave 2C, 2026-04-23 — file contains no branded strings requiring defense, retained on list for traceability)
- [x] `packages/twenty-front/src/modules/auth/sign-in-up/components/FooterNote.tsx` — `By using Fuse` ✅ (2026-03-05)
- [x] `packages/twenty-front/src/modules/activities/timeline-activities/utils/getTimelineActivityAuthorFullName.ts` — `Fuse` fallback ✅ (2026-03-05)
- [x] `packages/twenty-front/public/manifest.json` — `name`/`short_name` → Fuse ✅ (2026-03-05)

### Surfaced by wave 2C verifier (2026-04-23) — new branded-text debt

- [ ] `packages/twenty-front/src/pages/settings/applications/utils/getCustomApplicationDescription.ts` — user-visible markdown description references `twenty.com/developers/extend/apps/...` doc links and `create-twenty-app` CLI. Rewrite to Fuse docs (`docs.fusegtm.com`) + Fuse CLI name (or drop the create-CLI line if Fuse doesn't publish one).
- [ ] `packages/twenty-front/src/pages/settings/applications/utils/getStandardApplicationDescription.ts` — same shape as above; same rewrite.
- [ ] `packages/twenty-server/src/engine/workspace-manager/dev-seeder/core/utils/get-page-layout-widget-data-seeds.util.ts:620` — dev-seeder widget URL embeds `star-history.com/?repos=twentyhq%2Ftwenty`. Low priority (dev seeder, not runtime for prod workspaces). Rewrite to `repos=fuse-gtm%2Ffuse-v1` or drop the widget from the seed.

### Wave 2C auth-cookie note (not branding, but tracked here until the ops-log index lands)

- Upstream #19867 (Billing - fixes, cherry-picked in wave 2C) modified `useAuth.ts` to mirror `tokenPair` into a `secure`+`sameSite:lax` cookie on same origin. Fuse-controlled frontend host, not a security regression. No action required — flagged by verifier for deploy-runbook awareness.

## Licensing — Organization Self-Hosted (activated 2026-03-05)

- [x] `ENTERPRISE_KEY` set in `packages/twenty-docker/.env` → activates on next deploy ✅

### What Organization Self-Hosted unlocks (beyond Free Self-Hosted)
- **SSO integration** — Single Sign-On with identity providers (guard: `EnterpriseFeaturesEnabledGuard`)
- **Row-level permissions** — fine-grained access control at the record level (RLS predicates)
- **Event logs** — workspace-level audit/event log queries
- **Official Twenty team support** — priority support, not just Discord community
- **No open-source publication requirement** — custom code distribution exempt from AGPL copyleft
- **Workflow credits** — 5M/month (monthly billing) or 50M/year (annual billing)
- **Per-user licensing** — each user needs a licence; no free view-only seats

### Timeline
- Billing enforcement expected early Q2 2026, no firm date yet (per Twenty support)
- Contact: contact@twenty.com (mention self-hosting with Org license)

## Documentation & Legal Links (2026-03-05)

All codebase URLs redirected from `twenty.com`/`docs.twenty.com` → `fusegtm.com`/`docs.fusegtm.com` in commit `dfbfc47cd1`.

### Remaining Manual Steps

- [ ] **Push fuse-docs to GitHub** — create repo (e.g. `fusegtm/fuse-docs`), add remote, push `main`
  - Repo lives locally at `~/fuse-docs` (Streamdown fork, rebranded)
- [ ] **Deploy fuse-docs to Vercel** — connect GitHub repo, assign `docs.fusegtm.com` custom domain
  - If same Vercel account as existing v0 site: reassign domain in Vercel dashboard (Settings → Domains)
  - If different account: update DNS CNAME for `docs` subdomain to new Vercel deployment URL
  - No registrar-level DNS changes needed if already pointing to Vercel
- [ ] **Activate legal pages in Framer** — turn on Privacy Policy and Terms of Service pages at `fusegtm.com`
  - Pages exist in the Framer template (`stream.framer.website`), just need to be re-enabled
  - Codebase links point to `fusegtm.com/legal/terms` and `fusegtm.com/legal/privacy`
- [ ] **Stub remaining docs paths** — redirect rules added in code on 2026-03-05; verify in production after deploy:
  - `/user-guide/introduction` → `/docs/user-guide/introduction`
  - `/user-guide/workflows/capabilities/workflow-actions` → `/docs/user-guide/workflows`
  - `/developers/extend/capabilities/apps` → `/docs/developers/extend`
- [ ] **Test fuse-docs locally** — `cd ~/fuse-docs && pnpm install && pnpm dev` to verify build before deploy

## Notes

- This is branding/product copy debt, not platform reliability debt.
- Keep this separated from infra incident work so outages stay restore-first.
