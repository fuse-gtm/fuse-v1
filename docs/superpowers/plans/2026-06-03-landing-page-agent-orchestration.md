---
title: Landing page agent orchestration plan
date: 2026-06-03
status: active
scope: landing page only
prd: docs/superpowers/specs/2026-06-03-website-launch-wip.md
---

# Landing Page Agent Orchestration Plan

## Objective

Coordinate implementation agents to rebuild only the Fuse landing page (`/`)
using the Twenty-derived homepage foundation and the Midday UI extraction in
the governing PRD.

The orchestration goal is not parallel speed at any cost. It is safe,
verifiable delivery with tight scope control:

- landing page only
- no component deletion or replacement
- no invented design direction
- no fake proof
- no live search dependency on first paint
- Midday UI extraction implemented through existing website tokens/components

## Required Reads For Every Agent

Every implementation agent must read:

1. `/Users/dhruv/Documents/fuse-platform/CLAUDE.md`
2. `docs/superpowers/specs/2026-06-03-website-launch-wip.md`
3. `docs/superpowers/plans/2026-06-03-landing-page-agent-orchestration.md`
4. `.impeccable.md`

Agents may read older docs for history, but this plan and the June 3 PRD win
on conflict.

## Shared Hard Rules

All agents must follow these rules:

- Work only in `/Users/dhruv/Documents/fuse-platform`.
- Touch only the `packages/twenty-website-new` website package and the specific
  docs/tracking files assigned to the slice.
- Do not work in `/Users/dhruv/fuse-web`.
- Implement only the assigned `docs/open.md` issue ID.
- Preserve the Twenty-derived homepage component inventory.
- Do not remove or replace homepage components.
- Do not create new homepage presentational components.
- Do not alter section count, broad layout, H1 scale, or responsive behavior.
- Use Midday UI extraction exactly as written in the PRD.
- Do not use "Midday-like" as permission to invent a design.
- Do not implement broader Fuse platform tokens.
- Do not add dependencies.
- Do not ship Twenty CRM copy, fake proof, fake testimonials, fake logos,
  integrations, customer claims, or `Apollo for partnerships`.

## Workflow Pattern

Use a hybrid sequential/parallel workflow:

1. Sequential gates for scope-setting and baseline restoration.
2. Parallel implementation only after the baseline is restored and write scopes
   are disjoint.
3. Final sequential QA and deploy verification.

```text
Governance
  -> Baseline/layout freeze
    -> Theme pass
    -> Copy/data pass
      -> Hero Company | Person demo
      -> Proof-safe section rewrites
        -> QA and preview verification
```

Theme and copy may run in parallel only if their file scopes are separated.
Hero work should wait for baseline restoration and should coordinate with copy
fixtures.

## Agent Roles And Write Scopes

### Agent A - Governance And Tracking

Issue:

```text
website/landing-prd-and-orchestration
```

Write scope:

- `docs/superpowers/specs/2026-06-03-website-launch-wip.md`
- `docs/superpowers/plans/2026-06-03-landing-page-agent-orchestration.md`
- `docs/open.md`

Goal:

- Keep the PRD, orchestration plan, and open-work rows aligned.
- Convert the plan into landing-only tracer bullets.
- Remove ambiguity from the older full-site plan.

Exit checks:

- `docs/open.md` contains only landing-page slices under `## I-LAUNCH`.
- Each slice has type, blockers, acceptance criteria, and agent prompt.
- PRD and plan both say landing page only.

### Agent B - Baseline Layout Freeze

Issue:

```text
website/landing-baseline-layout-freeze
```

Write scope:

- `packages/twenty-website-new/src/app/(home)/page.tsx`
- homepage import wiring needed to restore the original Twenty section sequence

Goal:

- Restore or verify the original Twenty-derived homepage component structure
  from `f5a7d26fc1`.
- Remove hand-rolled homepage drift from later commits.
- Produce a component inventory before and after.

Exit checks:

- Homepage renders the original section family:
  `Menu`, `Hero`, `TrustedBy`, `Problem`, `ThreeCards`, `HomeStepper`,
  second `ThreeCards`, `Helped`, `Testimonials`, `Faq`.
- No section is deleted.
- No new homepage presentational component is introduced.
- H1 scale is not increased beyond the original Twenty homepage.

### Agent C - Midday Theme Pass

Issue:

```text
website/landing-midday-theme-pass
```

Write scope:

- `packages/twenty-website-new/src/theme/*`
- existing style files for homepage/hero components only when token wiring
  requires it

Goal:

- Replace the halftone-heavy visual treatment with the Midday-extracted
  white/warm canvas, hairlines, warm panels, quiet controls, and product shadow.
- Preserve layout while changing only allowed styling.

Exit checks:

- Halftone is gone on `/`.
- Background is white/warm, not purple/blue gradient.
- Button shape/radius matches PRD.
- Prompt and product visual use hairline/low-chrome treatment.
- No layout component was removed or replaced.

### Agent D - Fuse Copy And Data Pass

Issue:

```text
website/landing-fuse-copy-data-pass
```

Write scope:

- `packages/twenty-website-new/src/app/(home)/_constants/*`
- shared homepage FAQ constants if used by `/`
- homepage metadata for `/`

Goal:

- Replace Twenty CRM content with Fuse partner-led growth content while
  preserving existing component slots and content weight.

Exit checks:

- Homepage copy follows the required narrative order.
- Frankenstack is the root problem.
- Busywork, Credibility gap, and "Fake" AI are consequences.
- No fake proof appears in constants.
- Homepage title/description are Fuse-owned.

### Agent E - Hero Company | Person Demo

Issue:

```text
website/landing-hero-company-person-demo
```

Write scope:

- Existing hero/app-preview components under
  `packages/twenty-website-new/src/sections/Hero/`
- Hero demo fixtures/constants

Goal:

- Implement the required `Company | Person` prompt mode inside the main prompt
  composer and populate the existing app preview with cached results.

Exit checks:

- `Company | Person` appears in the main prompt area.
- There are no footer chips, bottom tabs, or `Partner Search` labels.
- Company mode shows company results.
- Person mode shows people/operator results.
- Rows include fit score, evidence, and next move.
- No live search is required for first paint.

### Agent F - Proof-Safe Section Rewrites

Issue:

```text
website/landing-proof-safe-section-rewrites
```

Write scope:

- homepage constants/data for trusted-by, testimonial, integration-like, or
  equivalent proof sections

Goal:

- Preserve visual density while converting proof-shaped slots into safe Fuse
  material.

Exit checks:

- Trusted-by/logos slot contains no fake logos or `trusted by`.
- Testimonials slot contains no fake testimonials or named customers.
- Integration-like slot contains partner-motion chips or evidence categories,
  not claimed integrations.
- Section visual weight remains similar to the original homepage.

### Agent G - QA And Preview Verification

Issue:

```text
website/landing-seo-qa-preview
```

Write scope:

- QA scripts or test files only if needed
- docs verification note if the project convention uses one

Goal:

- Verify the landing page is launchable and scope-compliant.

Exit checks:

- Package-local build succeeds from `packages/twenty-website-new`.
- Desktop and mobile screenshots for `/` pass.
- Source and rendered HTML copy guards pass.
- Layout guard confirms homepage component inventory is preserved.
- First-paint guard confirms no live search/community stats dependency.
- Vercel preview is checked if deployment is part of the slice.

## Agent Prompt Template

Use this prompt for every implementation slice:

```text
You are an independent Fuse landing-page implementation agent.

Read first:
1. /Users/dhruv/Documents/fuse-platform/CLAUDE.md
2. PRD: docs/superpowers/specs/2026-06-03-website-launch-wip.md
3. Orchestration: docs/superpowers/plans/2026-06-03-landing-page-agent-orchestration.md
4. .impeccable.md

Implement only issue <ID>.

Scope is landing page only: `/`.

The visual design target is the Midday homepage UI extracted in the PRD. Do
not invent a new design. Do not interpret "Midday-like" loosely. Implement the
specified Midday UI patterns: white/warm canvas, hairline borders, quiet header,
centered editorial hero, large product visual with soft shadow, compact
monochrome tiles, warm bento panels, checklist panel, quiet footer.

Preserve the Twenty-derived homepage component structure. Do not delete or
replace homepage components. Do not create new homepage presentational
components. Do not change section count, broad layout, H1 scale, or responsive
behavior.

Allowed changes:
- copy
- constants/data fixtures
- homepage metadata
- nav/footer labels visible on the homepage
- CTA destinations visible on the homepage
- theme colors through existing tokens
- button shape/radius through existing button/theme styles
- existing asset references
- halftone replacement with the specified Midday-style background

Hero hard rule:
`Company | Person` is the main prompt selector. It is not a footer chip, not a
bottom tab, and not `Company Search / Partner Search`.

Content hard rule:
Busywork, Credibility gap, and "Fake" AI are consequences of the Frankenstack
problem.

Proof hard rule:
No fake testimonials, logos, integrations, customer claims, `trusted by`,
Twenty CRM copy, or `Apollo for partnerships`.
```

## Verification Gates

### Gate 1 - Scope

Run before any implementation PR is accepted:

- Diff touches only assigned write scope.
- No `/product`, `/resources`, `/pricing`, `/the-future`, `/privacy`, or
  `/terms` implementation changes unless required by shared header/footer labels
  visible on `/`.
- No work in `/Users/dhruv/fuse-web`.

### Gate 2 - Layout Freeze

Verify:

- Homepage section inventory still includes the original section family.
- No homepage component file was deleted.
- No new homepage presentational component file was created.
- H1 scale was not enlarged.
- Broad responsive behavior is unchanged.

Suggested checks:

```bash
git diff --name-status f5a7d26fc1 -- packages/twenty-website-new/src/app/\\(home\\) packages/twenty-website-new/src/sections/Hero
rg -n "Company Search|Partner Search" packages/twenty-website-new/src
```

### Gate 3 - Midday UI Extraction

Verify screenshot and source evidence:

- white/warm canvas
- halftone removed
- hairline borders
- warm panels
- quiet header
- product visual with soft shadow
- no purple/blue gradient
- no 3D decorative objects
- no neon glow

### Gate 4 - Copy And Proof

Block public occurrences on `/` of:

- `Twenty`
- `Enterprise CRM`
- `custom CRM`
- `#1 open source CRM`
- `Salesforce`
- `HubSpot`
- `Apollo for partnerships`
- `trusted by`
- fake testimonials
- fake logos
- unsupported integrations
- customer proof

Also verify:

- Frankenstack is the root problem.
- Busywork, Credibility gap, and "Fake" AI are consequences.

### Gate 5 - First Paint And Performance

Verify:

- Homepage first paint does not call Exa/Websets/live search.
- Homepage first paint does not call Twenty community stats.
- Demo data is cached/static.
- Animations use transform/opacity where practical.
- Reduced motion is respected where motion is material.

### Gate 6 - Build And Screenshots

Run from:

```text
packages/twenty-website-new
```

Required:

```bash
npm run build --workspaces=false
```

Screenshot QA:

- `/` desktop
- `/` mobile

Screenshots must show:

- prompt selector in main prompt area
- app preview populated
- no text overflow
- no incoherent overlap
- no missing section mass

## Aggregation Rules

When multiple agents work in parallel:

- Each agent returns changed file paths and verification commands.
- The orchestrator checks for overlapping write scopes before merging.
- The orchestrator runs the verification gates after combining changes.
- Any agent that violates layout freeze or scope rules must be rejected or
  reworked before downstream slices continue.

## Completion Definition

The landing page implementation is complete when:

- all `docs/open.md` landing slices are done or explicitly deferred
- package-local build passes
- desktop and mobile screenshots pass for `/`
- copy/proof guard passes
- layout freeze guard passes
- first-paint guard passes
- Vercel preview is verified if deployment is requested

