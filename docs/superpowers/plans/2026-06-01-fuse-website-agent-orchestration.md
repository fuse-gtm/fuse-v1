# Fuse Website Agent Orchestration

> Date: 2026-06-01
> Purpose: governing implementation doc for the Vercel-linked Twenty-derived Fuse website rebuild

## Current Source Of Truth

Agents must work in the Vercel-linked source repo, not the older standalone `fuse-web` workspace.

- Correct repo: `/Users/dhruv/Documents/fuse-platform`
- Correct website package: `packages/twenty-website-new`
- GitHub repo: `fuse-gtm/fuse-v1`
- Vercel team: `fuse-6cf22f29`
- Vercel project: `fuse-platform-website`
- Vercel project id: `prj_dCMsz2UC4Vz40fy42PHNxlz5u0xi`
- Production branch: `main`
- Vercel root directory: `packages/twenty-website-new`
- Install command: `npm install --legacy-peer-deps --workspaces=false`
- Build command: `npm run build --workspaces=false`
- Output directory: `.next`
- Node version: `24.x`

The prior production deployment was CLI-deployed with `gitDirty=1`. Treat the local dirty tree as potentially containing deployed website work until reviewed. Do not reset, checkout, or delete pre-existing changes unless the user explicitly asks.

## Read First

Every implementation agent must read these before writing code:

1. `/Users/dhruv/Documents/fuse-platform/CLAUDE.md`
2. PRD: `docs/superpowers/specs/2026-06-01-fuse-website-twenty-juicebox-prd.md`
3. Governance: `docs/superpowers/plans/2026-06-01-fuse-website-agent-orchestration.md`
4. `.impeccable.md`

Do not use `docs/fuse-design-system-token-map.md` as the visual target for this launch website. That doc describes broader Fuse/platform token mapping. The current website rebuild should create or adjust launch website tokens inside `packages/twenty-website-new`.

If a task mentions the old `/Users/dhruv/fuse-web` workspace, stop and confirm whether the user intentionally changed scope. The default website scope is this repo's Vercel-linked `twenty-website-new` package.

## Strategy

Use the Twenty-derived website as the layout and engineering foundation. Keep the responsive shell, section system, Linaria setup, and Vercel build posture where they help.

Replace the story. Fuse content must be original:

- partner-led growth
- discovery
- scoring
- engagement
- operating complex partner ecosystems

The selected design direction is a Twenty x Juicebox x Amigo hybrid:

- Twenty foundation: large editorial hero, product preview, prompt/chat overlay, responsive shell.
- Juicebox interaction: prompt-first search, result cards/tables, Search/CRM/Agents-style flow, pricing shape.
- Amigo framing: asymmetric product media, restrained CTA, premium bordered stage, confident whitespace.
- Midday discipline: quiet whitespace and simple pricing.
- Chronicle support: clean pricing, resources, and legal routes.

The build should feel closest to "Prompt-First Partner Search" with "Enterprise Editorial Infrastructure" polish. Do not implement the broader Fuse token migration right now.

Do not copy Juicebox, Stitch, Midday, Workweave, Chronicle, Amigo, or Twenty. Use them as references, not source material.

## Reference Decision

The live Vercel page is still effectively Twenty. Its content is not usable as Fuse content, but the composition is valuable. The best path is:

1. Keep Twenty's foundation and hero/product-preview choreography.
2. Use Juicebox for prompt-first interaction and pricing shape.
3. Borrow Amigo-like editorial polish so the page does not look like a direct Juicebox clone.
4. Apply Midday restraint to whitespace and pricing.
5. Use Chronicle only for pricing/legal/resource cleanliness.

This replaces the four-option exploration with one implementation direction.

## Load-Bearing Product Model

The problem section must use this corrected model:

- The problem is the Frankenstack.
- Subtitle: teams are operating complex ecosystems on passive databases.
- Consequences:
  - Busywork
  - Credibility gap
  - "Fake" AI

Do not present Busywork, Credibility gap, and Fake AI as separate root problems. They are consequences of the Frankenstack.

## Content Guardrails

Do not ship:

- Twenty CRM story
- Twenty logo or Twenty-owned social links
- Twenty docs links
- Twenty customer case studies
- integrations/proof/customer claims before real Fuse material exists
- fake testimonials
- "Apollo for partnerships"
- generic "next-gen", "unleash", or enterprise SaaS filler copy

Do ship:

- simple, concrete Fuse copy
- founder-led clarity
- partner-specific workflows
- truthful early-stage positioning
- a product demo that feels real but is cached

## Launch Website Design System Governance

All design work must proceed through the website package's hierarchical token system:

1. `packages/twenty-website-new/src/theme/css-variables.ts`
2. `packages/twenty-website-new/src/theme/colors.ts`
3. `packages/twenty-website-new/src/theme/font.ts`
4. `packages/twenty-website-new/src/theme/spacing.ts`
5. `packages/twenty-website-new/src/theme/radius.ts`
6. component primitives
7. page sections

Rules:

- Do not implement the broader platform Fuse tokens right now.
- Do not scatter hard-coded colors across page sections.
- Do not add visual one-offs before checking whether the website theme can express them.
- Do not use Tailwind in this package; it is a Linaria/theme-token website.
- Do not add a new icon library. Use existing verified dependencies.
- Keep animated and interactive UI as isolated client leaves.
- Animate transform and opacity, not layout properties.
- Use reduced-motion handling where motion is material.
- Keep cards to real hierarchy. Avoid card nesting and generic equal three-card rows unless the existing system requires it and the layout is intentionally revised.
- Keep text inside containers across mobile and desktop; verify with screenshots.

Design direction:

- Prompt-first partner search.
- Editorial infrastructure polish.
- Light-first, precise, and product-forward.
- Restrained accent use; purple may appear only in prompt active states, score highlights, or data texture if the token system expresses it cleanly.
- Asymmetric section rhythm where useful, with strict mobile collapse.
- The prompt/search demo should be the remembered object.

## Website Route Target

```text
/
/product
/the-future
/resources
/pricing
/privacy
/terms
```

The legacy Twenty routes can remain only as temporary redirects or unpublished compatibility routes if needed during transition. They must not be promoted in navigation, sitemap, metadata, or primary CTAs.

## Homepage Target

```text
/
├── hero: centered Company | Person prompt
├── magic search/results demo
├── problem: The "Frankenstack" problem
│   ├── subtitle: operating complex ecosystems on passive databases
│   └── impact cards: Busywork, Credibility gap, "Fake" AI
├── solution: AI helps engage high-quality partners faster
├── works for many partner types
├── pricing tiers
├── FAQ
└── final CTA
```

The hero slice must use cached demos. Do not make public first paint depend on live Exa/Websets.

## Product Target

```text
/product
├── Discover
├── Score
└── Engage
```

Each pillar should show what the user can do and why it matters. Avoid abstract feature grids.

## Partner-Type Pages

Replace the old four-resource dropdown with four partner-type pages. Each page should drill into:

- recruit
- engage
- enable
- win

The exact four partner types may be finalized during implementation, but they should map to real Fuse ICPs. Suggested v1 set:

- technology and channel partners
- marketplace partners
- agency and solutions partners
- creator and affiliate partners

## Agent Prompt Template

Use this prompt for implementation slices:

```text
You are an independent Fuse website implementation agent.

Read first:
1. /Users/dhruv/Documents/fuse-platform/CLAUDE.md
2. PRD: docs/superpowers/specs/2026-06-01-fuse-website-twenty-juicebox-prd.md
3. Governance: docs/superpowers/plans/2026-06-01-fuse-website-agent-orchestration.md
4. .impeccable.md

Use skills:
- stitch-design
- design-taste-frontend
- impeccable
- prompt-engineering
- vercel-cli for deploy checks

Implement only issue <ID>. Preserve the strategy: Twenty layout foundation, Fuse-original content, Juicebox prompt/results interaction, Amigo editorial framing.

Work only in /Users/dhruv/Documents/fuse-platform unless the user explicitly changes scope.
Do not operate on /Users/dhruv/fuse-web for this website rebuild.
Do not implement broader platform Fuse tokens right now; use the launch website token hierarchy in packages/twenty-website-new.
```

Slice-specific prompt additions:

- Narrative slice: use the corrected Frankenstack model from the Fuse source material.
- Hero slice: use cached demos, not public first-paint live search.
- QA slice: verify no integrations, customer proof, fake testimonials, Twenty CRM copy, Twenty logo/assets, or "Apollo for partnerships" ship in v1.

## Implementation Order

1. `website/prd-governance-and-tracking`
2. `website/source-recovery-standalone-scaffold`
3. `website/design-tokens-and-shell`
4. `website/homepage-magic-hero`
5. `website/homepage-narrative-sections`
6. `website/product-pages`
7. `website/future-resources-pricing-legal`
8. `website/seo-performance-qa-deploy`

## Test Plan

- Package-local website build succeeds from the Vercel root directory.
- No root Twenty/Nx build is required for website v1.
- Playwright screenshots pass for:
  - `/`
  - `/product`
  - `/pricing`
  - `/resources`
  - `/the-future`
  - `/privacy`
  - `/terms`
- Homepage first paint does not depend on live Exa/Websets.
- No Twenty CRM copy, Twenty logo/assets, integrations/proof/customer claims, fake testimonials, or "Apollo for partnerships" ship.
- Vercel preview and production alias checks are verified after deploy.

## Done Criteria

The rebuild is done when the Vercel-linked Git source can reproduce the production website, the target sitemap exists, all main routes pass screenshot QA, the copy guard passes, and Vercel preview/production checks confirm the correct aliases.
