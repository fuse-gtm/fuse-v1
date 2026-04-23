# Wave 2A — Watch Items & Pre-existing Failures

**Context:** Wave 2A (PR #15) cherry-picked 18 security fixes. Post-execution verifier passed all 4 guardrails with 0 blockers but surfaced 3 watch items. Separately, PR #15 CI surfaced 2 pre-existing regressions on main unrelated to wave 2A.

---

## Watch items from wave 2A verifier (non-blockers, not reverted)

### W1. `oauth-discovery.controller.ts` trusts Host header → needs `TRUST_PROXY` in prod

**Source:** upstream commit landed via wave 2A; RFC 9728 metadata derives issuer URL from `request.get('host')`.

**Risk:** Host-header spoofing behind a reverse proxy (Caddy in Fuse prod) could publish attacker-controlled URLs at the OAuth well-known endpoints.

**Mitigation (now):** `TRUST_PROXY=1` added to `packages/twenty-docker/.env.fuse-prod.example`. New Fuse installs will have it by default. **Verify current prod `.env` on EC2 host `i-05b90467e22fec9d2` has this set before exposing OAuth endpoints externally.**

**Long-term:** rename the var in code to something more Fuse-specific if Twenty renames upstream. Track in deploy runbook SPEC-004.

---

### W2. `marketplace.resolver.ts` auth guard reduction (upstream #19409)

**Source:** wave 2A cherry-pick. `UserAuthGuard` removed from `installMarketplaceApp`. Workspace-scoped API keys can now call it without interactive user context.

**Risk to Fuse today: zero.** Fuse does not expose a marketplace surface to end users. No workspace API keys issued externally.

**Re-examine if:** Fuse ever ships a marketplace UI, or issues workspace-scoped API keys to external partners.

**Tracking:** here. Revisit at marketplace feature design (not scheduled).

---

### W3. Branding drift in new app-template READMEs

**Source:** wave 2A cherry-picks added new app-template README files referencing `twenty.com` / `docs.twenty.com`.

**Risk:** text-only, no runtime egress. Low priority.

**Fix path:** fold into `docs/fuse-branding-followups.md` as a sweep task. These are in `packages/twenty-apps/community/*/README.md` patterns — template, not user-facing in Fuse product.

---

## Pre-existing main regressions surfaced by PR #15 CI (NOT caused by wave 2A)

### R1. `FuseDesignScorecard.stories.tsx` — Linaria-migration fallout

**File:** `packages/twenty-front/src/modules/ui/theme/components/__stories__/FuseDesignScorecard.stories.tsx`

**Errors:**
- `Cannot find module '@emotion/react' or its corresponding type declarations.` (line 1)
- `Module '"twenty-ui/theme"' has no exported member 'ThemeType'.` (line 5)

**Cause:** Fuse-added storybook file (commit `30ed823092 feat: add fuse storybook design options`) imports `useTheme` from `@emotion/react` and `ThemeType` from `twenty-ui/theme`. The Linaria migration (wave 1) removed `@emotion/react` as a runtime dep and moved `ThemeType` export from `twenty-ui/theme` → `twenty-ui/theme-constants`. This story file was never updated.

**Wave 2A is NOT the cause.** Verified: `git log origin/main..integration/upstream-wave2-security -- packages/twenty-front packages/twenty-ui` returns zero commits. Wave 2A touched zero frontend files.

**Fix (single file, ~2 lines):**
1. Replace `import { useTheme } from '@emotion/react';` — post-Linaria, no runtime `useTheme`. Either:
   - Remove `useTheme` usage and use `themeCssVariables` from `twenty-ui/theme-constants` directly, OR
   - Delete the story file (it's a Fuse-added demo, not product code).
2. Change `import { type ThemeType } from 'twenty-ui/theme';` → `import { type ThemeType } from 'twenty-ui/theme-constants';`

**Not fixed in this PR** — out of scope for the wave 2 planning paper trail. Spin off as a separate small PR before the next frontend-heavy wave (2C).

### R2. No other pre-existing failures found

Only R1 surfaced. All other CI checks (server, ui, shared, etc.) green on main + on the wave 2A branch.

---

## Decision log (2026-04-23)

- **Merge PR #15 despite R1 CI failures:** pre-existing, confirmed unrelated to wave 2A, main branch has no branch protection. Admin merge permitted.
- **Merge PR #16 after CI:** planning docs, no code delta, green.
- **R1 fix:** separate task, scheduled before wave 2C (which touches frontend heavily and will re-trigger these errors on every PR).
- **W1 `TRUST_PROXY`:** added to env example. CTO to verify prod host has it set — action item.
- **W2 marketplace:** no action, tracking only.
- **W3 branding README drift:** fold into `docs/fuse-branding-followups.md` at next branding sweep.
