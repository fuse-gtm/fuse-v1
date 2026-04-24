# SPEC-006 — Partner Artifact Generator

**Priority:** P2 (after SPEC-001 cherry-pick close-out + SPEC-005 Apollo activation)
**Status:** Scoped, not started — agent should NOT start without founder go-ahead
**Author:** Founder-sourced scope (2026-04-23)
**Depends on:** SPEC-001 (wave-2 sync for upstream SDK + app framework), SPEC-005 (Apollo enrichment for partner firmographic data), Partner-OS schema spine (partner records + pipeline)

---

## 1. Context — what exists today and why this work matters

Fuse is a partnerships-native CRM. Partner records, pipeline state, deals, and enriched firmographic data (via Apollo + partner-OS schema spine) live in the metadata store and are queryable via GraphQL / REST. Today, all downstream partner-facing artifacts — marketing decks, QBRs, portal pages, PR announcements, marketplace listings, website forms — are produced out-of-band in third-party tools (Google Slides, Notion, Webflow, Docs). Every partnerships team produces these artifacts manually, and the data flow is one-way (CRM → screenshot → deck).

Twenty's upstream app framework (#18544 SDK provisioning, #20004 `definePageLayoutTab`, #19984 page-layout fixes — all landing via wave-2) ships a logic-function execution runtime and a front-component renderer that together enable in-CRM programmable surfaces. The SDK can read partner records, call external APIs, and render React components against workspace data. Combined with LLM calls via the Anthropic API (enterprise license already held per MEMORY), this unlocks a class of "read partner record → synthesize artifact → publish-or-attach" capabilities that cannot exist outside a partnerships-native CRM.

**Why this matters now:** the SDK + page-layout infrastructure that just landed in wave-2 is the exact substrate this feature needs. Waiting to build it post-wave-3 means shipping partner-OS without the one capability that structurally differentiates it from a generic CRM with a partnerships tab.

## 2. Scope

### In scope

A single partner-OS module — `packages/twenty-server/src/modules/partner-os/artifact-generator/` + matching front surface — that exposes a unified "generate artifact from partner record(s)" capability. Six artifact types, shipped in priority order:

| # | Artifact type | Input | Output | Surfaces |
|---|---------------|-------|--------|----------|
| 1 | **Partner marketing deck** | Partner record + deal pipeline + joint-solution story | PPTX or Google Slides deck, theme-matched to partner brand | Download + push-to-Drive |
| 2 | **QBR report** | Partner record + last-N-quarter deal history + pipeline health metrics | PDF + editable Doc | Download + push-to-Drive + email draft |
| 3 | **Partner PR announcement** | Partner record + launch event metadata (close-won deal, joint GA, etc.) | Press-release draft in Fuse brand voice + distribution list suggestions | Draft in CRM + copy-to-clipboard |
| 4 | **Marketplace listing** | Partner record + enriched firmographics + Fuse marketplace template | In-app marketplace entry (record page) + optional sync to `fuse-website` listings | In-app record + website page |
| 5 | **Partner website form generator** | Partner record + intake requirements (discovery questions, qualification criteria) | Embeddable form (HTML) targetting the partner's website + Fuse webhook for submissions | Code snippet + live preview |
| 6 | **Doc editor** (stretch) | Arbitrary markdown file in `docs/` + natural-language edit instruction | Git diff preview + branch + PR | Admin-panel only (not end-user facing) |

Each artifact type is a **logic function** (per the SDK framework from wave-2 #18544) that:
1. Accepts a partner record ID (or set of IDs) as input.
2. Reads the partner record and its relations from the metadata store.
3. Calls Anthropic API with a templated prompt + the partner's enriched data.
4. Post-processes the LLM output into the target format (PPTX, PDF, HTML, PR, etc.).
5. Returns either a downloadable asset (blob) or a CRM record (with the generated content as fields).

The **front surface** is a single "Generate Artifact" action on the partner record page, exposing the 6 types as a menu. Implemented as a `definePageLayoutTab` extension per #20004, so the generator UI is colocated with the partner record.

### Out of scope

- **No custom fine-tuned model.** Use Anthropic's Claude via the Anthropic API with prompt engineering only. Future work if quality caps.
- **No multi-tenant artifact sharing marketplace.** Artifacts stay in the workspace that generated them.
- **No autonomous artifact publishing.** Every generated artifact requires human approval before push/send/publish. This is a generate-and-review flow, not a background agent.
- **No partner-portal SSO integration in the initial ship.** Marketplace listings are read-only CRM records + optional static sync to the marketing website. Full portal (with partner logins, commissions dashboards, etc.) is a separate spec.
- **No integration with non-Anthropic LLMs in the initial ship.** Vercel AI SDK provider abstraction is allowed, but only Anthropic provider is wired. Multi-provider is future work.

## 3. Implementation

### 3.1 Module layout

```
packages/twenty-server/src/modules/partner-os/artifact-generator/
  artifact-generator.module.ts                   # NestJS module (imports MetadataStore + OpenAI + Storage)
  artifact-generator.service.ts                  # orchestrator: pick generator, call LLM, post-process, return blob/record
  generators/
    base-generator.interface.ts                  # IArtifactGenerator { kind, generate(input) -> output }
    marketing-deck.generator.ts                  # PPTX via pptxgenjs or Google Slides API
    qbr-report.generator.ts                      # PDF via puppeteer + markdown → html, or Google Docs API
    press-release.generator.ts                   # plain-text + markdown, saves as note on partner record
    marketplace-listing.generator.ts             # creates/updates marketplace record object + optional website sync
    website-form.generator.ts                    # emits HTML snippet + registers webhook endpoint
    doc-editor.generator.ts                      # reads file, calls LLM, proposes diff, opens PR (admin-panel only)
  prompts/
    marketing-deck.prompt.md                     # templated prompt with {{partner}} {{deals}} placeholders
    qbr-report.prompt.md
    press-release.prompt.md
    marketplace-listing.prompt.md
    website-form.prompt.md
    doc-editor.prompt.md
  dto/
    generate-artifact.dto.ts                     # input DTO
    artifact-response.dto.ts                     # { kind, content, downloadUrl? , recordId? }
  __tests__/
    artifact-generator.service.spec.ts
    generators/*.spec.ts
```

Front surface (under `packages/twenty-front/src/modules/partner-os/artifact-generator/`):

```
components/
  GenerateArtifactButton.tsx                     # entry button on partner record page
  ArtifactGeneratorMenu.tsx                      # menu w/ 6 types
  ArtifactPreviewModal.tsx                       # preview + approve/edit/regenerate/download UI
hooks/
  useGenerateArtifact.ts                         # calls backend, streams progress
states/
  artifactGenerationInFlightState.ts             # jotai atom for loading state per partner
```

### 3.2 Data flow

```
[Partner record page]
       │
       ▼  (click "Generate Artifact" → menu select)
[ArtifactGeneratorMenu]
       │  POST /api/partner-os/artifact-generator/generate
       │  { partnerId, kind, options? }
       ▼
[artifact-generator.service.ts]
       │  1. Fetch partner + relations from metadataStore (objectMetadataItemsSelector)
       │  2. Pick IArtifactGenerator by kind
       │  3. Build prompt from template + data
       │  4. Call Anthropic via ai-sdk (with retry + streaming)
       │  5. Post-process → target format
       │  6. Persist: blob storage (S3/MinIO) OR record update
       │  7. Emit AuditLog event
       ▼
[ArtifactPreviewModal]
       │  stream progress + render result
       ▼
[User: approve / edit / regenerate / download]
```

### 3.3 Prompt templating

Each prompt file in `prompts/*.prompt.md` uses Handlebars-style placeholders (`{{partner.name}}`, `{{#each deals}}...{{/each}}`). Keep prompts in version-controlled files rather than DB rows so they're reviewable and auditable. Token budget per prompt: hard limit 12k in, 4k out (Claude Sonnet defaults).

### 3.4 LLM integration

Use **Vercel AI SDK** (`ai` package + `@ai-sdk/anthropic` provider) for:
- Streaming responses to the preview modal.
- Structured output via `generateObject()` when the target format is JSON-shaped (marketplace listing, website form schema).
- Tool calls for generators that need mid-stream data enrichment (e.g., marketplace listing can tool-call Apollo enrichment during generation).

Model defaults: Claude Sonnet 4.5 for generation, Claude Haiku 4.7 for short post-processing (doc edits, title rewrites). Configurable per generator via `ARTIFACT_GENERATOR_<KIND>_MODEL` env.

### 3.5 Feature-flag gating

New feature flag: **`IS_PARTNER_ARTIFACT_GENERATOR_ENABLED`**. Default: **false** (opt-in per workspace, admin-panel toggle). Standard three-layer gate per Fuse convention:
- Backend: check in `artifact-generator.service.ts` guard — return 403 if flag is off.
- Frontend: hook `useIsPartnerArtifactGeneratorEnabled()` — conditional on rendering of `GenerateArtifactButton`.
- Activation: per-workspace setting page under `/settings/partner-os/artifact-generator`.

Add the flag to `packages/twenty-shared/src/types/FeatureFlagKey.ts` + seed-default migration in the next instance-command-fast after SPEC-001 closeout.

### 3.6 Storage

- **Blobs** (PPTX/PDF outputs): reuse existing Twenty file-storage config (`FILE_STORAGE_TYPE=local|s3`). Key pattern: `artifacts/{workspaceId}/{partnerId}/{artifactKind}-{timestamp}.{ext}`.
- **Record-attached** (press-release text, marketplace listing data): persist as fields on a new `partnerArtifact` object (added to partner-OS schema spine).
- **Web-form HTML**: persist the schema in `partnerArtifact` record + serve rendered form via a public endpoint `/p/form/{artifactId}` (existing public-domain infra).

## 4. Acceptance criteria

1. **All 6 generators work E2E** on a seeded partner record in local dev. Each returns the expected output type.
2. **Feature flag gates correctly** — with flag off, the button does not render and the backend endpoint returns 403.
3. **Audit trail** — every generation logs to `auditLog` with `{userId, partnerId, kind, promptHash, outputSize, durationMs}`. No LLM payload content (privacy).
4. **Token/cost telemetry** — each generation emits a metric `partner_artifact_generator_tokens_total{kind}` via existing Prometheus pipeline.
5. **Rate limiting** — per-workspace limit (configurable, default 50 generations / hour) with 429 response on overage.
6. **Sovereignty** — no network egress to `twenty.com` or upstream Twenty endpoints at runtime. Only Anthropic API + Fuse's own storage backend. Guardrail agent verifies pre-merge.
7. **Unit tests** — every generator has a spec with a mocked Anthropic client returning a canned response. Service orchestrator tested end-to-end with in-memory metadata store.
8. **E2E test** — Playwright test in `twenty-e2e-testing` that clicks Generate → picks "Press release" → verifies preview modal opens with streamed content.

## 5. Guard rails

- **Don't auto-publish.** Every generator MUST return content to the preview modal. Direct-to-website / direct-to-Drive push requires a separate explicit user action.
- **Don't store LLM prompts or outputs in plain-text audit logs.** Hash prompts, count tokens in outputs, but never log the content itself — partner data may be sensitive.
- **Don't couple to a specific LLM provider in generator interfaces.** The `IArtifactGenerator` interface accepts a generic `LanguageModel` from Vercel AI SDK, not a raw Anthropic client. Makes future multi-provider work trivial.
- **Don't regenerate Apollo-enriched fields on every call.** Cache enriched data on the partner record (per SPEC-005) and read the cache. Fresh Apollo calls only on explicit user request.
- **Don't allow doc-editor artifact type to operate on any file outside `docs/`.** Path allowlist enforced at the generator level. Doc editor generates Git diffs, not direct writes — user reviews diff + opens PR.
- **Don't skip the rate-limit check even for admins.** Admin can raise the limit per workspace, but every request must go through the same rate-limit middleware.
- **Don't import `objectMetadataItemsState` directly in the new module.** Use `objectMetadataItemsSelector` (read-only selector post-#18651 refactor). Fuse has a compat shim, but new code should use the canonical name.

## 6. Open questions (founder to resolve before start)

1. **Marketplace publishing target.** When a user publishes a marketplace listing, does it go (a) only to the in-app marketplace record page, (b) also static-sync to `fuse-website`, or (c) push to an external directory? Scoping decision affects partner-website form generator scope too.
2. **Doc-editor scope.** Is this admin-only (agent-assisted doc maintenance) or end-user (partnership team edits their own runbooks)? Affects RBAC + UI.
3. **QBR cadence.** Auto-generate quarterly based on pipeline snapshot at quarter close, or on-demand only? Auto-generate needs a scheduled job + email delivery.
4. **PR announcement distribution.** Stays as draft in CRM, or auto-send to a pre-configured journalist list? If the latter, spec needs an email template system + list management.
5. **Cost ceiling.** Per-workspace monthly spend cap for LLM token cost? Without this, a workspace could burn the Fuse Anthropic budget via excess generations.

## 7. Cross-references

- Depends on [SPEC-001 Upstream Cherry-Pick Plan](SPEC-001-upstream-cherry-picks.md) — need wave-2 SDK framework + #20004 `definePageLayoutTab`.
- Depends on [SPEC-005 Apollo Enrichment Integration](SPEC-005-apollo-enrichment.md) — partner firmographics required for high-quality marketing/QBR output.
- References Partner-OS schema spine work (see `docs/fuse-partner-os-data-model.md` + `feat/partner-os-schema-spine` branch).
- Uses feature flag pattern established by [SPEC-002 Feature Flag Backfill](SPEC-002-feature-flag-backfill.md).
- Deployment via [SPEC-004 Deploy Runbook](SPEC-004-deploy-runbook.md).

## 8. Follow-ups (out of this spec but triggered by it)

- **Partner portal** (SPEC-007 candidate) — full partner-facing portal w/ SSO, commissions, deal registrations. Artifact generator is the content substrate; the portal is where partners consume it.
- **Fuse prompt library** — as prompts proliferate, consider a shared library in `packages/twenty-shared/src/prompts/` with versioning + A/B testing harness.
- **Multi-provider LLM routing** — when Anthropic hits a rate-limit or for cost optimization, route to alternate providers (Gemini, GPT) via AI SDK.
- **Fine-tuned Fuse model** — once artifact volume justifies it, fine-tune a model on Fuse's highest-quality generated artifacts to reduce per-call cost.
