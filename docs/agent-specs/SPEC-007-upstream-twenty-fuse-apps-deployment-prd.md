# SPEC-007 — Upstream-Based Twenty Deployment with Fuse Partner Apps

**Priority:** P0
**Status:** PRD, ready for triage
**Label:** needs-triage
**Decision:** Use upstream Twenty as the platform base, keep a thin Fuse shell branding overlay, and move Partner OS product behavior into deployable Twenty apps.

---

## Problem Statement

Fuse needs to get back onto a current Twenty foundation without dragging forward a large, fragile fork. The current repository contains valuable Fuse work, but much of it was built as fork-level Partner OS bootstrap logic while upstream Twenty has since shipped app deployment primitives that can create data models, roles, views, layouts, logic functions, front components, skills, agents, install hooks, and private app distribution.

Because Fuse does not currently have users to migrate, previously shipped Partner OS bootstrap work should be treated as sunk cost unless it contains reusable product decisions: partner taxonomy, schema choices, workflow definitions, views, prompts, seed data, or parity ledgers.

At the same time, Fuse cannot ship as an obviously unbranded Twenty instance. The deployment plan must preserve the user-facing Fuse shell work already done: auth and onboarding copy, emails, product name, legal links, favicon and PWA metadata, default workspace naming, docs links, and other visible Twenty-to-Fuse replacements.

The core problem is therefore not "how do we deploy the current fork?" It is "how do we deploy a current Twenty-based Fuse distribution where the host shell is branded as Fuse and the partnerships product is delivered as installable Fuse apps?"

## Solution

Ship Fuse as two layers:

1. **Fuse Shell Distribution**
   - A minimal upstream-based Twenty distribution that carries only host-shell branding, deployment configuration, and any unavoidable platform toggles.
   - This layer owns the public app experience outside installed apps: auth, onboarding, emails, legal links, product name, PWA metadata, icons, default workspace naming, support/docs links, and deployment settings.
   - This layer must stay thin enough that future upstream updates are routine.

2. **Fuse Partner Apps**
   - Private Twenty app packages that install Fuse-specific partnerships capabilities into a workspace.
   - The first app family should be built from a reusable `PartnerAppSpec` contract.
   - The first product app should be **Agency Partner Program**, with the Dub affiliate/referral parity work used as the pattern for what a complete partner-program app includes.
   - Partner apps own Fuse's product behavior: custom objects, fields, relations, roles, views, page layouts, navigation, logic functions, front components, skills, agents, install hooks, and seed data.

The old Partner OS bootstrap path should not be the production deployment mechanism. It remains reference material for domain modeling and historical decisions.

## User Stories

1. As the founder, I want Fuse to run on a current upstream Twenty base, so that we are not permanently stuck maintaining a stale fork.
2. As the founder, I want Fuse-specific product behavior to live in deployable apps, so that partner-type capabilities can evolve without core fork surgery.
3. As the founder, I want prior Partner OS work treated as sunk cost unless reusable, so that old exploratory work does not drive the architecture.
4. As the founder, I want the app shell to say Fuse, so that prospects do not experience the product as a generic Twenty instance.
5. As the founder, I want auth pages to use Fuse copy and legal links, so that the first user-facing screen matches the product and company.
6. As the founder, I want onboarding to reflect Fuse's partnerships use case, so that new users land in the right mental model.
7. As the founder, I want emails to be branded as Fuse, so that invites, verification, password, and workspace lifecycle messages do not leak Twenty branding.
8. As the founder, I want PWA metadata, icons, favicon, and social previews to be Fuse-owned, so that browser and install surfaces match the brand.
9. As the founder, I want docs and support links to point to Fuse-controlled surfaces where appropriate, so that users are not routed into upstream Twenty positioning.
10. As a partnerships operator, I want to install an Agency Partner Program app, so that I can manage agency partners without manual workspace configuration.
11. As a partnerships operator, I want agency-specific objects and fields, so that agency capabilities, service categories, contacts, and program status are captured explicitly.
12. As a partnerships operator, I want standard Company, Person, and Opportunity records extended rather than replaced, so that partner work stays connected to CRM primitives.
13. As a partnerships operator, I want agency application intake, so that partner candidates can apply or be reviewed before entering active CRM operations.
14. As a partnerships operator, I want application approval to create an enrollment and default records, so that accepted partners are ready to operate immediately.
15. As a partnerships operator, I want application rejection to retain reasons and evidence, so that review decisions remain auditable.
16. As a partnerships operator, I want partner groups and tiers, so that different agency cohorts can use different rules, rewards, resources, and workflows.
17. As a partnerships operator, I want referral mechanics modeled separately from agency partner type, so that the taxonomy stays correct.
18. As a partnerships operator, I want services mechanics modeled separately from referral mechanics, so that delivery partnerships and referral partnerships are not conflated.
19. As a partnerships operator, I want commercial models captured independently, so that commission, revenue share, co-marketing, product benefits, and certifications are all represented.
20. As a partnerships operator, I want views and navigation seeded on install, so that the app is usable immediately after deployment.
21. As a partnerships operator, I want record page layouts tailored to agency workflows, so that I can review status, capabilities, contacts, customers, attribution, resources, and tasks without custom setup.
22. As a partnerships operator, I want logic functions for application intake and approval, so that the lifecycle is repeatable.
23. As a partnerships operator, I want logic functions for referral lead and sale ingestion, so that agency-sourced pipeline can be attributed.
24. As a partnerships operator, I want idempotency for external events, so that retries do not create duplicate leads, sales, or attribution records.
25. As a partnerships operator, I want rollups and repair jobs, so that dashboards stay accurate after webhook or ingestion failures.
26. As a partnerships operator, I want front components for review panels and performance panels, so that the operator workflow is not just raw tables.
27. As a partnerships operator, I want a Fuse operator skill and agent, so that AI assistance respects the 3-axis partner model.
28. As a partnerships operator, I want the AI operator to classify real partner type separately from program mechanic, so that "affiliate" is never treated as an Axis 1 partner type.
29. As a partnerships operator, I want noisy research universes excluded from active CRM records, so that only approved, applied, referred, or actively reviewed partners enter operations.
30. As an app developer, I want a `PartnerAppSpec` contract, so that each partner-type app can be authored consistently.
31. As an app developer, I want shared taxonomy and validation helpers, so that every partner app preserves Fuse's canonical model.
32. As an app developer, I want app packages to use stable identifiers, so that upgrades preserve installed workspace metadata.
33. As an app developer, I want integration tests against a real Twenty test server, so that app install and upgrade behavior is proven.
34. As an app developer, I want deployment automation for private app publishing and install, so that staging and production use the same release path.
35. As an app developer, I want semver-controlled app updates, so that production installs are traceable and rollback is straightforward.
36. As an operator, I want staging to prove the shell overlay and partner apps together, so that production cutover is low risk.
37. As an operator, I want old bootstrap scripts kept out of the production path, so that app deployment is the source of truth.
38. As an operator, I want workbench and table exploration excluded, so that the deployment plan does not absorb unrelated experiments.
39. As an operator, I want a clear rollback boundary between shell distribution and installed apps, so that platform issues and app issues can be recovered independently.
40. As a future customer, I want Fuse to feel like a coherent partnerships product from the first screen through partner workflows, so that the product does not feel assembled from unrelated CRM parts.

## Implementation Decisions

- Use an upstream-based Twenty deployment as the platform foundation. Do not ship from the existing Partner OS fork as the default production path.
- Keep a minimal Fuse shell distribution for host-shell branding and unavoidable deployment configuration.
- Port the existing Fuse branding baseline into the shell distribution: product name, auth copy, onboarding copy, legal footer URLs, email templates, email logo/footer text, PWA metadata, favicon/icons, default workspace naming, not-found/system fallback copy, support/docs links, and application settings descriptions.
- Keep shell branding changes in a small auditable patch set. Do not use shell branding as a reason to carry forward broad Partner OS fork modules.
- Move Partner OS product behavior into private Twenty app packages.
- Create `fuse-partner-core` as the shared foundation app or shared app module. It owns canonical taxonomy, shared standard-object extensions, common partner profile/enrollment primitives, shared roles, shared seed data, and shared operator vocabulary.
- Create `fuse-agency-partner-program` as the first product app. It owns agency-specific schema, application workflow, enrollment workflow, service capability fields, partner groups, attribution surfaces, views, page layouts, front components, logic functions, skill, agent, and seeds.
- Use the Dub affiliate/referral parity work as the app-design template, not as the first literal app unless agency scope depends on referral mechanics first.
- Preserve Fuse's 3-axis model in every app: Axis 1 is partner type, Axis 2 is program mechanic, Axis 3 is ecosystem.
- Keep `agency` as an Axis 1 partner type. Keep `referral` as Axis 2 `program_type`. Do not model affiliate/referral as an Axis 1 partner type.
- Model commercial value separately from mechanic. Commission, flat fee, revenue share, margin, warrant, co-marketing, product benefits, and certifications are commercial models, not partner types.
- Define a stable `PartnerAppSpec` contract for authoring future apps. It must cover app identity, Axis 1 partner type, supported Axis 2 mechanics, standard object extensions, custom objects, relations, roles, views, page layouts, navigation, front components, logic functions, app variables, skills, agents, install hooks, and seed data.
- Do not build a spec compiler first unless duplication becomes painful. V1 can hand-author the Agency app while keeping the spec contract as the decision boundary.
- Use Twenty private app publishing and install for deployment. Use semver for every app release.
- Use post-install hooks for safe seed data and starter configuration. Seed only operational scaffolding and demo-safe data.
- Do not bulk-import noisy discovery or enrichment universes into the operational CRM. Promote records only when they are approved, applied, referred, actively reviewed, or directly tied to a current go-to-market action.
- Use app-owned HTTP routes for public/application intake and signed event ingestion.
- Use app-bound public domains for partner-facing or public routes when Twenty supports the required routing and isolation.
- Use an edge adapter only if measured redirect/tracking latency or reliability requires it. The edge adapter remains part of the app architecture, not a separate product.
- Keep raw event capture and rollups explicit for attribution and analytics. Start with app-visible records and add a warehouse or dedicated event store only after measured need.
- Build deployment as two independently verifiable release units: shell distribution release and partner app release.
- Keep the current MCP/bootstrap scripts, old Partner OS deployment runbooks, and old schema docs as reference material. Do not run them as the production activation path.
- Ignore workbench and table setup work completely for this deployment plan.
- Do not create a public npm marketplace app for V1. Private app distribution is the default.
- Publish implementation issues in dependency order and label each with `needs-triage`, an execution type label, and the relevant area label.

## Multi-Agent Implementation Plan and Order

Use a hierarchical orchestration model: one implementation lead coordinates specialist agents, with parallel work only after the platform and taxonomy contracts are stable.

### Agent Roles

- **Implementation Lead**: owns sequencing, dependency handoffs, issue status, and final integration.
- **Platform Agent**: owns upstream Twenty base, app deployment, production settings, and rollback.
- **Shell Branding Agent**: owns Fuse host-shell branding, emails, assets, docs/legal links, and brand audits.
- **Partner App Foundation Agent**: owns `PartnerAppSpec`, taxonomy validation, shared app primitives, and install contracts.
- **Agency App Agent**: owns Agency Partner Program objects, fields, relations, views, page layouts, front components, logic functions, skill, agent, and seeds.
- **Runtime Workflow Agent**: owns public routes, application lifecycle, event ingestion, idempotency, attribution, and rollups.
- **QA/Release Agent**: owns integration tests, staging smoke, production cutover checks, and rollback proof.

### Orchestration Pattern

1. **Sequential foundation**: create the upstream-based staging shell, branding overlay, and app-spec contract before app implementation starts.
2. **Parallel build**: once the contract exists, build the shell audit, partner core app, and Agency app skeleton in parallel.
3. **Sequential runtime slices**: implement application lifecycle before attribution/event ingestion so enrollment records exist before events target them.
4. **Consensus gate**: require Platform, Branding, Partner App, and QA agents to sign off before production cutover.
5. **Result aggregation**: the Implementation Lead updates this PRD and the issue tracker after each slice lands.

### Implementation Order

| Order | Slice | Type | Depends on |
|---:|---|---|---|
| 1 | Upstream-based staging deployment tracer | AFK | None |
| 2 | Fuse shell branding overlay tracer | AFK | None |
| 3 | Partner app contract and taxonomy tracer | AFK | None |
| 4 | Partner core app install tracer | AFK | 1, 3 |
| 5 | Agency app schema and operator views tracer | AFK | 3, 4 |
| 6 | Agency application lifecycle tracer | AFK | 5 |
| 7 | Agency referral attribution and event ingestion tracer | AFK | 5, 6 |
| 8 | Agency operator panels, skill, and agent tracer | AFK | 5, 6 |
| 9 | End-to-end staging release and rollback tracer | AFK | 1-8 |
| 10 | Production cutover decision and launch runbook | HITL | 9 |

### Published Issue Map

| Order | Issue | Type | Labels |
|---:|---|---|---|
| 1 | [#43 — Stand up upstream-based Twenty staging tracer](https://github.com/fuse-gtm/fuse-v1/issues/43) | AFK | `needs-triage`, `type:AFK`, `area:deployment`, `source:SPEC-007` |
| 2 | [#44 — Port Fuse shell branding overlay tracer](https://github.com/fuse-gtm/fuse-v1/issues/44) | AFK | `needs-triage`, `type:AFK`, `area:shell-branding`, `source:SPEC-007` |
| 3 | [#45 — Define PartnerAppSpec and taxonomy contract tracer](https://github.com/fuse-gtm/fuse-v1/issues/45) | AFK | `needs-triage`, `type:AFK`, `area:partner-apps`, `area:taxonomy`, `source:SPEC-007` |
| 4 | [#46 — Ship fuse-partner-core install tracer](https://github.com/fuse-gtm/fuse-v1/issues/46) | AFK | `needs-triage`, `type:AFK`, `area:partner-apps`, `area:taxonomy`, `source:SPEC-007` |
| 5 | [#47 — Ship Agency Partner Program schema and operator views tracer](https://github.com/fuse-gtm/fuse-v1/issues/47) | AFK | `needs-triage`, `type:AFK`, `area:partner-apps`, `source:SPEC-007` |
| 6 | [#48 — Ship Agency application lifecycle tracer](https://github.com/fuse-gtm/fuse-v1/issues/48) | AFK | `needs-triage`, `type:AFK`, `area:partner-apps`, `area:runtime-workflows`, `source:SPEC-007` |
| 7 | [#49 — Ship Agency referral attribution and event ingestion tracer](https://github.com/fuse-gtm/fuse-v1/issues/49) | AFK | `needs-triage`, `type:AFK`, `area:partner-apps`, `area:runtime-workflows`, `source:SPEC-007` |
| 8 | [#50 — Ship Agency operator panels, skill, and agent tracer](https://github.com/fuse-gtm/fuse-v1/issues/50) | AFK | `needs-triage`, `type:AFK`, `area:partner-apps`, `area:runtime-workflows`, `source:SPEC-007` |
| 9 | [#51 — Run end-to-end staging release and rollback tracer](https://github.com/fuse-gtm/fuse-v1/issues/51) | AFK | `needs-triage`, `type:AFK`, `area:deployment`, `area:testing`, `source:SPEC-007` |
| 10 | [#52 — Approve production cutover and launch runbook](https://github.com/fuse-gtm/fuse-v1/issues/52) | HITL | `needs-triage`, `type:HITL`, `area:deployment`, `area:testing`, `source:SPEC-007` |

### Communication and Handoff Rules

- Each issue must include the source PRD path, dependencies, acceptance criteria, and whether it is AFK or HITL.
- Agents communicate through GitHub issue comments and PR links; no hidden state is required to continue a slice.
- A slice is complete only when it is demoable or verifiable on its own.
- Any agent that finds a platform limitation in Twenty app deployment must document the limitation and propose the smallest shell-distribution patch that avoids broad fork growth.
- Any agent touching shell branding must run a brand audit for required Fuse strings and disallowed Twenty strings in the primary user-facing surfaces.
- Any agent touching partner taxonomy must preserve scalar Axis 1 partner type and keep referral/affiliate as Axis 2 mechanics.

## Testing Decisions

- Test external behavior, not implementation details. Good tests prove that a workspace receives the right objects, fields, relations, views, layouts, routes, seeds, and branded shell surfaces after install or deploy.
- Test the Fuse shell overlay with a brand audit that scans user-facing shell surfaces for required Fuse strings and disallowed Twenty strings.
- Test shell assets by verifying manifest metadata, favicon/icon availability, email logo rendering, legal URLs, docs URLs, and default workspace naming.
- Test app manifests by validating one application config, one default role, stable identifiers, required variables, no duplicate object or field names, and expected app metadata.
- Test `PartnerAppSpec` parsing and validation as a deep module. It should reject invalid taxonomy, duplicate identifiers, missing app variables, and conflation of Axis 1 partner type with Axis 2 mechanics.
- Test taxonomy helpers as a deep module. They should enforce scalar partner type, supported program mechanics, allowed commercial models, and agency/referral separation.
- Test install and upgrade behavior against an ephemeral Twenty server using the existing app integration-test pattern.
- Test Agency app installation by verifying application registration, standard object extensions, custom objects, relation fields, indexes, views, navigation, page layouts, front components, skills, agents, and post-install seeds.
- Test application intake logic functions with valid submissions, missing required fields, duplicate applicants, suspicious applicants, and existing company/person matches.
- Test approval logic functions by proving that approval creates or links the expected records and does not duplicate enrollments.
- Test rejection logic functions by proving that reason, risk status, and future-review state are retained.
- Test event ingestion logic functions with valid lead events, valid sale events, duplicate event IDs, duplicate invoice IDs, invalid signatures, missing click/customer identifiers, and unsupported event types.
- Test attribution and rollups by verifying that lead/sale events update partner, program, group, and link metrics.
- Test front components at the behavior level: review panel loads correct applicant context, approval action calls the correct route, performance panel reads rollups, and error states are visible.
- Test the AI skill and agent with prompt-level fixtures that prove the operator preserves the 3-axis taxonomy and never treats affiliate/referral as a partner type.
- Test deployment smoke in staging before production: health check, auth, email render, app install, seeded views, public route, logic function execution, worker logs, and rollback.
- Test rollback separately for shell distribution and partner apps. Rolling back an app version should not require rolling back the whole Twenty deployment.

## Out of Scope

- Shipping from the existing Partner OS fork as the default production path.
- Running the old MCP/bootstrap scripts as the production activation mechanism.
- Workbench, table setup, or exploratory discovery workspace work.
- Migrating existing user data. There are no current users to preserve.
- Public npm marketplace distribution.
- A full partner portal with partner login, payout self-service, and external partner sessions.
- High-volume event warehouse work before measured need.
- Building a full app-spec compiler before the first app proves the shape.
- Rewriting upstream Twenty core beyond the thin shell branding overlay and unavoidable deployment toggles.
- Broad visual redesign of all Twenty UI components. The shell overlay should brand the product without turning into a full design-system migration.

## Further Notes

- This plan changes the old deployment calculus. The old choice was "deploy the current fork or fresh Twenty." The new choice is "deploy an upstream-based Fuse distribution plus private Fuse apps."
- The thin shell overlay is the compromise that preserves Fuse identity without making Partner OS a permanent fork burden.
- The first deliverable should be staging, not production: current upstream Twenty plus Fuse shell branding plus the Agency Partner Program app installed into a clean workspace.
- The next planning artifact after this PRD should split implementation into two tickets or issues: one for the Fuse shell overlay, one for the Agency Partner Program app.
- The old Partner OS schema and Dub parity notes are still valuable. They should be mined for product semantics, not treated as deployment instructions.
- The acceptance bar is a coherent Fuse experience: a user should sign in, receive emails, see the product shell, install or use the Agency app, and run an agency partner workflow without seeing generic Twenty positioning in the primary surfaces.
