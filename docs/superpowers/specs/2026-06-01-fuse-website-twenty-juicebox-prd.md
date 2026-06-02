# Fuse Website Rebuild PRD

> Date: 2026-06-01
> Scope: Fuse marketing website on the Twenty-derived Vercel project
> Source posture: Twenty layout foundation, Fuse-original content, Juicebox interaction reference, Amigo editorial framing

## Problem Statement

Fuse needs a website that explains the product it is actually building: AI for partner-led growth, discovery, scoring, and engagement. The current live Vercel page is still effectively Twenty. The title and hero story are built around enterprise CRM at AI speed, and the copy says Twenty provides custom CRM building blocks. That is not usable as Fuse content.

The composition is valuable: a large editorial hero, product preview, prompt/chat overlay, and polished Twenty-derived page choreography. The rebuild should keep that foundation but replace the story, navigation, route map, demo, and design system direction with a Fuse-owned launch website.

The website also needs to be operable by future implementation agents. They need clear product strategy, route scope, design-system rules, and implementation slices before code changes continue. Without that governance, agents will keep drifting between the old `fuse-web` codebase, the Twenty upstream website, and the actual Vercel-linked source package.

The load-bearing problem model is:

- The problem is the "Frankenstack": teams operate complex partner ecosystems on passive databases and scattered tools.
- Busywork, Credibility gap, and "Fake" AI are consequences of that Frankenstack.
- The solution is not "a better CRM" in the Twenty sense. The solution is AI that helps teams engage high-quality partners faster.

## Solution

Rebuild the Fuse website using the existing Twenty-derived website as the layout and engineering substrate, while replacing the narrative, navigation, design tokens, demo surfaces, and route map with a Fuse-owned website.

The chosen launch design direction is a Twenty x Juicebox x Amigo hybrid:

- Use Twenty's foundation and hero/product-preview choreography.
- Use Juicebox's prompt-first search and results interaction as the closest product reference.
- Use Amigo's editorial polish: bigger type, asymmetric product rhythm, restrained borders, one confident CTA, and a premium bordered stage.
- Use Midday's whitespace and pricing discipline.
- Use Chronicle's clean pricing, resources, and legal-page clarity.

This is not a broader Fuse platform token implementation. The website should use the `packages/twenty-website-new` token hierarchy for launch website tokens.

The home page should make the product obvious immediately: a centered Company | Person prompt, a magic search/results demo, a clear Frankenstack problem section, impact cards, solution narrative, partner-type coverage, pricing tiers, FAQ, and final CTA.

The product page should organize the product around Discover, Score, and Engage. The future, resources, pricing, privacy, and terms pages should be rebuilt or adjusted to match the v1 sitemap. V1 must not ship invented proof, integrations, customer testimonials, or "Apollo for partnerships" positioning.

### Website Sitemap

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

/product
├── Discover
├── Score
└── Engage

/the-future
/resources
/pricing
/privacy
/terms
```

### Four Partner-Type Pages

The old four-item Resources dropdown should become a Fuse-owned set of four partner-type pages. Each page should show the same operating model through a specific partner ecosystem:

- recruit
- engage
- enable
- win

The goal is to show that Fuse is flexible while feeling deep in the user's world. These pages should not be generic "resources" pages, and they should not reuse Twenty's User Guide, Developers, Partners, or Releases framing.

## User Stories

1. As a founder evaluating Fuse, I want the hero to show a Company | Person prompt, so that I immediately understand this is a search-first partner intelligence product.
2. As a partnerships leader, I want to see realistic partner discovery results, so that I can understand how Fuse helps me find useful partner candidates.
3. As a partnerships leader, I want the demo to work on first paint without live search, so that the page feels fast and reliable.
4. As a channel leader, I want the page to explain the Frankenstack problem, so that I can recognize the operational mess Fuse is solving.
5. As a marketer, I want Busywork, Credibility gap, and Fake AI framed as consequences, so that the problem story remains accurate.
6. As an ecosystem operator, I want Fuse to explain why passive databases fail, so that the product feels built for real partner work.
7. As a growth lead, I want to understand how AI helps engage high-quality partners faster, so that I can connect the product to revenue work.
8. As a buyer, I want the website to avoid fake customer proof, so that the company feels honest and early.
9. As a buyer, I want pricing to be simple and visible, so that I can decide whether Fuse is worth a conversation.
10. As a buyer, I want FAQ answers that address practical concerns, so that I do not have to decode vague AI claims.
11. As a user on mobile, I want the prompt and results demo to be readable and stable, so that the product remains clear on a phone.
12. As a user on desktop, I want the page to feel polished but not overdecorated, so that I trust the product.
13. As a future implementation agent, I want a canonical PRD, so that I can avoid re-litigating the website strategy.
14. As a future implementation agent, I want a governance doc, so that I know the correct repo, package, Vercel project, and design constraints.
15. As a future implementation agent, I want implementable slices, so that I can ship independently without breaking the whole website.
16. As a future implementation agent, I want the launch website design system to be tokenized, so that visual changes are consistent and reviewable.
17. As a future implementation agent, I want clear no-go content rules, so that I do not ship Twenty copy, fake proof, integrations, or "Apollo for partnerships."
18. As a visitor, I want the product page to explain Discover, Score, and Engage, so that I can understand the workflow in one pass.
19. As a visitor, I want partner-type pages that map recruit, engage, enable, and win to my ecosystem, so that Fuse feels specific rather than generic.
20. As a marketplace partnerships lead, I want a partner-type page that speaks to my motion, so that the site reflects my operating model.
21. As an agency partnerships lead, I want a partner-type page that speaks to my motion, so that I can picture using Fuse beyond a generic CRM.
22. As a creator or affiliate partnerships lead, I want a partner-type page that speaks to my motion, so that discovery and engagement feel relevant.
23. As a technology/channel partnerships lead, I want a partner-type page that speaks to my motion, so that scoring and enablement feel grounded.
24. As a privacy-conscious buyer, I want privacy and terms routes to exist and be easy to find, so that the website is commercially credible.
25. As an SEO crawler, I want metadata and sitemap routes to match Fuse's live sitemap, so that the website does not index Twenty-era pages.
26. As a deploy operator, I want Vercel preview and production alias checks, so that the correct website is shipped.
27. As a QA agent, I want screenshot checks across all main routes, so that layout regressions are caught before deploy.
28. As a QA agent, I want copy guards for forbidden claims, so that Twenty CRM copy and fake proof do not ship.
29. As a visitor, I want the site to feel fast, so that I can interact with the search demo without waiting on external APIs.
30. As a founder, I want the site to express the why behind Fuse in simple language, so that the company feels opinionated without sounding inflated.

## Implementation Decisions

- Use the existing Twenty-derived website as the layout, component, responsive, and Vercel deployment foundation.
- Keep the website implementation inside the Vercel-linked website package, not the separate `fuse-web` project.
- Do not implement broader Fuse platform tokens right now. Implement the launch website visual direction through `packages/twenty-website-new` CSS variables and theme aliases.
- Build the content model around Fuse's partner-led growth product: Discover, Score, Engage.
- Replace the old resource dropdown concept with four Fuse partner-type pages.
- Use cached search/demo fixtures for the homepage hero and magic results demo. Live search must not be required for first paint.
- Make a small set of deep, testable modules:
  - route manifest and sitemap model
  - navigation/footer model
  - cached magic search demo data model
  - pricing tier model
  - partner-type phase model
  - forbidden-copy QA guard
- Design from a token hierarchy: CSS variables, theme color aliases, typography, radius, spacing, component primitives, then sections.
- Preserve server components for static content where possible. Isolate animation and interactive demo components as client leaves.
- Use existing verified dependencies only. The package already includes Linaria, Framer Motion, GSAP, Three, and Tabler icons; do not add new libraries unless there is a clear reason.
- Do not ship customer proof, logos, integrations, fake testimonials, or "Apollo for partnerships" language in v1.
- Avoid copying Juicebox, Stitch, Twenty, Amigo, Midday, Workweave, or Chronicle. Use them only as design and interaction references.

## Testing Decisions

- Tests should verify external behavior: visible copy, route existence, metadata, sitemap entries, first-paint independence from live search, and absence of forbidden claims.
- Screenshot QA should cover home, product, pricing, resources, the-future, privacy, and terms at desktop and mobile widths.
- Build verification should run package-locally for the website package. A root Twenty/Nx build is not required for the website v1.
- Performance verification should confirm the homepage does not await live Exa/Websets or Twenty community-stat calls for first paint.
- Copy QA should check for Twenty CRM story, Twenty logo/assets, integrations/proof/customer claims, fake testimonials, and "Apollo for partnerships."
- Design QA should check website token usage, responsive layout stability, text fit, and no card-nesting or generic equal-card grids.

## Out of Scope

- Building the Fuse application itself.
- Implementing the broader platform Fuse token migration.
- Adding live Exa/Websets search to the first-paint homepage.
- Adding customer logos, testimonials, integrations, or proof before real material exists.
- Recreating Twenty's CRM product narrative.
- Rebuilding the monorepo root or requiring a full Nx/Twenty build for website validation.
- Shipping a broad upstream Twenty sync as part of the website rebuild.

## Further Notes

- The current Vercel production deployment was historically deployed from the CLI with a dirty tree. Future work should make the website reproducible from Git.
- The live Vercel project is now connected to GitHub with the website package as its root directory.
- The founder "why" material and YC application material can inform tone, but the website should stay concise and concrete.
- Copy should be simple and direct, closer to Paul Graham's plain-language style than enterprise SaaS language.
