---
title: Website launch WIP - landing page only
date: 2026-06-03
status: active
scope: landing page only
governing: true
supersedes:
  - docs/superpowers/specs/2026-06-01-fuse-website-twenty-juicebox-prd.md
  - docs/superpowers/plans/2026-06-01-fuse-website-agent-orchestration.md
---

# Website Launch WIP - Landing Page Only

## Purpose

This is the governing PRD for the Fuse landing page rebuild.

The implementation scope is only `/`. The site should use the
Twenty-derived website as the engineering foundation, but the visual target
for this pass is the Midday homepage UI extracted into explicit rules. Agents
must not invent their own design direction while implementing.

This document is the contract for scope, problem, outcome, design rules,
implementation slices, and verification.

## Source Of Truth

Work only in:

```text
/Users/dhruv/Documents/fuse-platform/packages/twenty-website-new
```

Do not work in:

```text
/Users/dhruv/fuse-web
```

Use this implementation baseline:

```text
f5a7d26fc1 docs(website): capture Fuse website rebuild strategy
```

That commit keeps the PRD, governance, Vercel setup, Fuse destination
constants, and the Twenty-derived section foundation. Do not continue from the
later hand-rolled homepage implementation except as reviewed copy/data
reference.

## Scope

In scope:

- Landing page route `/`.
- Homepage constants and data fixtures.
- Existing homepage components and existing hero/app-preview components used by
  `/`.
- Homepage metadata.
- Header/footer labels and CTA destinations visible on `/`.
- Theme color tokens, button shape/radius tokens, and the current halftone
  replacement.

Out of scope for this pass:

- `/product`
- `/resources`
- partner-type pages
- `/pricing`
- `/the-future`
- `/privacy`
- `/terms`
- broader route implementation
- broader Fuse platform tokens
- live search or Exa/Websets integration
- customer proof, testimonials, integration logos, or case studies

Future pages may remain untouched, placeholder, or redirected. This pass should
not spend implementation effort on them.

## Problem

The live page still tells the Twenty CRM story. That is the wrong product
story for Fuse.

Fuse needs a landing page that makes the product clear in the first viewport:
partner teams can search for companies and people, see scored results with
evidence, and act on the next move. The page must replace the CRM narrative
with Fuse's partner-led growth narrative without destroying the Twenty-derived
layout foundation.

The load-bearing problem model is:

- The root problem is the Frankenstack.
- The subtitle is: teams operate complex partner ecosystems on passive
  databases and scattered tools.
- Busywork, Credibility gap, and "Fake" AI are consequences of the
  Frankenstack. They are not separate root problems.

## Outcome

A visitor landing on `/` should understand, without scrolling far:

1. Fuse helps teams find partners worth engaging.
2. Search starts from a `Company | Person` prompt.
3. Results appear in a product-like app preview with fit score, evidence, and
   next move.
4. Fuse is not a CRM clone and not a fake proof-heavy landing page.
5. The visual feel is quiet, warm, product-forward, and close to Midday's
   homepage UI, adapted to Fuse content.

## Founder Feedback Preserved

The following feedback is binding:

- Do not operate in the old `/Users/dhruv/fuse-web` workspace for this website.
- Do not call the current broad rewrite close to ready.
- Do not delete Twenty sections without replacement.
- Current stricter rule: do not remove or replace homepage layout components in
  this pass.
- Do not create new homepage presentational components.
- Preserve the original amount of homepage content.
- Preserve the original Twenty hero H1 scale.
- The top two product objects must be:
  1. the original-style prompt box, split into `Company | Person`;
  2. the app/results preview populated by the prompt.
- `Company | Person` must not be footer chips, bottom tabs, sidebar tabs, or
  `Company Search / Partner Search`.
- The prompt/results behavior should feel like Fuse, not an invented dashboard.
- Use Midday UI extraction as a concrete spec, not loose inspiration.

## Layout Freeze

The Twenty-derived homepage component structure is the engineering foundation.

Do not change:

- section count
- broad section order, except to restore the original Twenty sequence
- hero scale
- component inventory
- layout grids
- widths
- spacing architecture
- breakpoints
- responsive behavior
- page choreography
- visual hierarchy

Do not:

- delete a homepage component
- replace a homepage component with a new custom component
- create new homepage presentational components
- add decorative 3D objects
- add unrelated tabs, chip rows, or decorative panels
- introduce a new design system

Allowed:

- rewrite visible copy
- rewrite constants/data fixtures
- replace demo records
- update homepage metadata
- update header/footer labels visible on `/`
- update CTA destinations visible on `/`
- adjust theme colors
- adjust button radius/shape
- replace the current halftone background with the Midday-style background
  treatment below
- style existing components to match the Midday UI extraction rules

## Midday UI Extraction

The implementation target is not "Midday-like." It is the Midday homepage UI
translated into explicit Fuse rules.

Primary reference surfaces:

- Live homepage: `https://midday.ai/`
- GitHub website package: `https://github.com/midday-ai/midday/tree/main/apps/website`
- Local screenshot: `/Users/dhruv/Downloads/Midday — The business stack for modern founders.png`

Use these UI patterns exactly as guidance for existing Fuse/Twenty components.
Do not wholesale-copy Midday content or claim Midday product functionality.

### Canvas

Midday pattern:

- white or near-white page canvas
- warm off-white panels
- thin horizontal section separators
- low contrast supporting surfaces
- product UI is the main visual object
- no noisy decoration

Fuse target values:

- Canvas: `#FFFFFF`
- Ink: `#121212` or existing Fuse `#1C1C1C`
- Muted text: `#616161`
- Hairline border: `#DAD9D5`
- Warm panel: `#F7F6F2`
- Deeper warm panel: `#E6E3DE`
- Accent/focus: charcoal by default; existing Fuse blue only when required for
  prompt active state or score highlight

Do not use:

- halftone
- purple-blue AI gradients
- decorative blobs
- floating 3D objects
- dark dashboard blocks
- neon glow

### Header

Midday pattern:

- very thin top announcement strip
- compact nav height
- small logo at far left
- sparse nav links
- right-aligned quiet sign-in/CTA area
- no heavy header background
- no oversized nav labels
- no bright header CTA

Fuse adaptation:

- Top strip may say: `Fuse is rebuilding partner-led growth.`
- Keep header visually quiet.
- Landing-pass nav may be minimal: `Product`, `Resources`, `Pricing`,
  `Talk to us`.
- Header CTA should be quiet and low-chrome.
- If linked pages are out of scope for this pass, do not spend this pass
  rebuilding those pages.

### Hero

Midday pattern:

- centered editorial hero
- generous whitespace
- small pill/eyebrow above headline
- large but controlled headline
- short body copy
- one primary action surface
- large product visual below copy

Fuse adaptation:

- Keep original Twenty H1 scale. Do not make it larger.
- The prompt box is the hero's central action.
- `Company | Person` is the main mode selector.
- Product visual appears below and is visually connected to the prompt.

Recommended copy:

- Eyebrow: `Partner search, without the Frankenstack`
- H1: `Find the partners worth engaging`
- Body: `Fuse helps partner teams discover companies and people, score fit with evidence, and turn search into the next move.`

Do not show implementation-only copy such as "cached demo" to users.

### Prompt Box

Midday pattern:

- low chrome
- hairline border
- white or warm off-white surface
- small radius, about `8px`
- charcoal active state
- no neon focus glow
- no pill explosion
- no footer chips

Required Fuse behavior:

- selector: `Company | Person`
- selector is inside or directly above the prompt input area
- `Company` and `Person` are the only two modes
- second mode is not `Partner Search`
- mode selector is not in the footer
- mode selector is not in bottom tabs

Prompt examples:

- Company: `Find companies selling into Shopify agencies that could help us reach ecommerce operators.`
- Person: `Find people who influence agency partnerships in the Shopify ecosystem.`

### Product Visual

Midday pattern:

- large centered product surface below hero
- white app frame
- heavy soft drop shadow below the product object
- lots of whitespace around it
- product UI is the main visual asset

Fuse adaptation:

- Use the existing Twenty `Hero.HomeVisual` / app-preview foundation.
- Replace CRM records with Fuse partner search results.
- Company mode shows ranked company results.
- Person mode shows ranked people results.
- Rows include name, partner type or role, fit score, evidence, and next move.

Visual treatment:

- App shell background: white.
- App panel borders: hairline warm gray.
- Active row: warm off-white.
- Score badge: charcoal text on warm panel, or subtle tokenized blue.
- Shadow: one large soft shadow under the app preview, similar to the Midday
  screenshot shadow.

### How It Works Section

Midday pattern:

- left side: compact text stack with a section label and active items
- right side: bordered product/data panel
- inactive items muted
- active item stronger with a small indicator
- spacious, not card-heavy

Fuse content:

- `Discover high-fit companies`
- `Find the right people`
- `Score with evidence`
- `Send the next move`

Use existing Twenty section machinery. Do not invent a new interaction unless
the existing component already supports it.

### Feature Grid

Midday pattern:

- small icon tiles
- minimal borders
- mostly monochrome
- compact captions
- no colorful SaaS icon grid

Fuse content:

- `Discover` - partner search
- `Score` - fit and evidence
- `Engage` - next move
- `Recruit` - start the relationship
- `Enable` - give partners context
- `Win` - move deals or distribution
- `Companies` - account-level search
- `People` - operator/influencer search

If the existing Twenty component has a fixed card count, preserve the component
and map the closest content.

### Consequence Bento

Midday pattern:

- small bento-like metrics
- warm panels
- one larger highlighted panel
- simple specific copy
- organic-looking data, but no fake proof
- very low chrome

Fuse content:

- Heading: `Less partner busywork. Better judgment.`
- Cards:
  - `Manual list building` - `Hours disappear into spreadsheets and LinkedIn tabs.`
  - `Context switching` - `Signals live across email, notes, CRM, and search.`
  - `Weak scoring` - `Teams guess which partners are worth time.`
  - `AI without context` - `Generic answers look useful until someone checks the evidence.`
- Large highlight:
  - Label: `What changes`
  - Text: `The search, evidence, score, and next move live together.`
  - Value: `1 useful list`

This section must preserve the corrected problem model: these are consequences
of the Frankenstack.

### Checklist Panel

Midday pattern:

- centered section
- small icon or simple visual
- warm rectangular panel
- checkmark list
- one quiet text link below
- no large card stack

Fuse content:

- Heading: `Ready for partner work, without extra admin`
- Body: `Searches, scores, notes, and next steps stay organized so partner teams can act while the context is still fresh.`
- Checklist:
  - `Companies and people grouped by partner motion`
  - `Evidence attached to every score`
  - `Next move written from the context`
  - `Saved searches for repeatable partner plays`
  - `No live search required for first paint`

### Testimonials / Proof Slot

Midday uses testimonial cards. Fuse must not invent proof.

Keep the visual role, but replace the content type.

Allowed replacement:

- founder POV cards
- product principles
- anonymous workflow examples
- "what we believe" notes

Do not use:

- customer names
- fake quotes
- logos
- "trusted by"
- customer counts

Fuse content:

- Heading: `Built for people who do partner work`
- Subheading: `The product starts from the work operators already do: finding overlap, judging fit, and deciding who deserves attention.`
- Cards:
  - `Evidence beats enrichment`
  - `Partner fit is contextual`
  - `The next move matters`
  - `Search should become a system`

### Integration-Like Slot

Midday uses an integrations marquee. Fuse must not ship fake integrations.

Keep the visual density if the slot exists, but replace the content.

Allowed replacement:

- partner-type chips
- ecosystem motion chips
- search-source examples without claiming integrations
- ICP examples

Fuse content:

- Heading: `Works across partner motions`
- Body: `Use the same search and scoring loop for different ecosystems.`
- Chips:
  - `Technology partners`
  - `Channel partners`
  - `Marketplace partners`
  - `Agencies`
  - `Solutions partners`
  - `Creators`
  - `Affiliates`
  - `Communities`
  - `Consultants`
  - `Operators`
  - `Influencers`
  - `Platforms`

Do not include logos or integration names.

### Footer

Midday pattern:

- quiet footer
- multi-column links
- low-contrast legal/status row
- optional oversized pale wordmark treatment
- no loud CTA block

Fuse adaptation:

- Keep existing footer component structure.
- Remove Twenty references.
- Keep legal links if present.
- Keep links low-contrast and tidy.
- Do not add a large link farm beyond what the existing component already
  supports.

## Typography

Use the existing Twenty website font system. Do not add new font packages in
this pass.

Visual target:

- editorial headline feel
- original Twenty H1 scale
- compact body copy
- muted text that is clearly secondary
- no giant custom H1
- no all-caps section labels unless already required by the existing component

Copy style:

- simple
- specific
- short sentences
- no enterprise SaaS filler

## Buttons And Controls

Midday extraction:

- primary action uses charcoal
- primary action text is white
- radius about `8px`
- no glow
- no gradient
- hover: slight background shift
- active: tactile pressed state
- focus: visible but restrained ring
- secondary controls are text or hairline buttons

Fuse prompt mode:

- `Company | Person` uses the same low-chrome control language
- active mode uses charcoal fill or strong text
- inactive mode is muted
- no decorative pills

## Landing Page Narrative

Required order:

1. Hero: `Find the partners worth engaging`
2. Prompt: `Company | Person`
3. Results preview: companies/people with fit score, evidence, and next move
4. Problem: `The Frankenstack problem`
5. Consequences: `Busywork`, `Credibility gap`, `"Fake" AI`
6. Solution: `AI helps engage high-quality partners faster`
7. Workflow: `Discover`, `Score`, `Engage`
8. Partner motions: technology/channel, marketplace, agency/solutions,
   creator/affiliate
9. FAQ
10. Final CTA

Do not reduce the amount of content versus the original Twenty homepage.

## Homepage Component Mapping

Agents must rewrite existing homepage slots using the Midday UI extraction
above.

- `Menu.Root`
  - Keep structure.
  - Apply quiet Midday header feel through allowed styling.
  - Rewrite labels.
- `Hero.Root`
  - Keep structure and original H1 scale.
  - Remove halftone.
  - Use white/warm canvas and hero spacing.
  - Add Fuse prompt-first copy/data.
- `Hero.HomeVisual`
  - Keep app-preview structure.
  - Apply large product-screenshot treatment.
  - Replace CRM data with Company/Person results.
- `TrustedBy.Root`
  - Keep slot.
  - Do not show logos/proof.
  - Convert to partner-motion chips or evidence categories.
- `Problem.Root`
  - Keep slot.
  - Rewrite to Frankenstack problem.
- `ThreeCards.Root`
  - Keep slot.
  - Use for consequence cards or Discover/Score/Engage depending on the
    existing fixed shape.
- `HomeStepper.ScrollSection`
  - Keep slot.
  - Rewrite as Fuse workflow.
- Second `ThreeCards.Root`
  - Keep slot.
  - Rewrite as partner motions or product capabilities.
- `Helped.Root`
  - Keep slot.
  - Rewrite as AI engagement/next-move section.
- `Testimonials.Root`
  - Keep slot.
  - Convert from testimonials to founder POV/product principles.
- `Faq.Root`
  - Keep slot.
  - Rewrite FAQ and CTA copy.

## Content Guardrails

Do not ship:

- Twenty CRM copy
- `Enterprise CRM`
- `custom CRM`
- Twenty logo/assets
- fake testimonials
- fake customer proof
- fake customer logos
- fake integrations
- `trusted by`
- `Apollo for partnerships`
- generic AI/SaaS filler

Use:

- partner discovery
- partner scoring
- evidence
- engagement
- ecosystem context
- company search
- person search
- partner-led growth
- Frankenstack

## Homepage Metadata

Update only homepage metadata in this pass.

- Title: `Fuse - Find the partners worth engaging`
- Description: `Fuse helps partner teams discover companies and people, score fit with evidence, and engage high-quality partners faster.`
- OpenGraph title/description should match Fuse copy.
- No Twenty CRM metadata on `/`.

## Implementable Slices

The detailed issue rows live in `docs/open.md` under `## I-LAUNCH`.

Required slice order:

1. `website/landing-prd-and-orchestration`
2. `website/landing-baseline-layout-freeze`
3. `website/landing-midday-theme-pass`
4. `website/landing-fuse-copy-data-pass`
5. `website/landing-hero-company-person-demo`
6. `website/landing-proof-safe-section-rewrites`
7. `website/landing-seo-qa-preview`

## Launch Acceptance

Landing page launch is ready only when:

- `/` is implemented in the correct Vercel-linked package.
- The original Twenty-derived homepage component inventory is preserved.
- Original Twenty H1 scale is preserved.
- The halftone is removed.
- The background matches the Midday extraction: white/warm canvas, hairlines,
  warm panels, and soft product shadow.
- `Company | Person` appears in the main prompt area.
- No footer chips or bottom tabs are used for the mode selector.
- App preview shows cached Company/Person results with fit score, evidence,
  and next move.
- Trusted/testimonial/integration-like slots contain no fake proof.
- No Twenty CRM story remains on the landing page.
- Desktop and mobile screenshots pass.
- Package-local build succeeds.
