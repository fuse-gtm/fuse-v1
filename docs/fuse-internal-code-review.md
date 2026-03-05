# Fuse-v1 Internal Code Review

**Date:** 2026-03-04
**Branch reviewed:** `feat/partner-os-schema-spine` (partner-os module), `main` (branding, upstream patches)
**Reviewer:** Claude Code (automated)

---

## Scope

| Area | Files | Lines |
|------|-------|-------|
| partner-os module | 6 TypeScript files | ~2,017 |
| bootstrap command | 1 TypeScript file | ~57 |
| MCP bootstrap scripts | 4 Python files | ~1,739 |
| Branding changes | 17 files | ~74 changed lines |

---

## P0 — Must Fix Before Launch

### 1. Zero test coverage across partner-os services

**Files:** All files under `packages/twenty-server/src/modules/partner-os/`

No `.spec.ts` or `.test.ts` files exist for any partner-os service. Critical paths without coverage:

- `partner-os-metadata-bootstrap.service.ts` (509 lines) — orchestrates object/field/relation creation with idempotency logic. Failure leaves workspace in inconsistent state.
- `partner-scoring.service.ts` (106 lines) — scoring algorithm with potential edge cases around empty/null inputs.
- `partner-discovery-adapter.service.ts` (48 lines) — external adapter without input validation.

**Recommendation:** Write unit tests for bootstrap idempotency (create, re-run, partial failure), scoring edge cases (zero partners, missing fields, division-by-zero), and adapter input validation. Target: 80% coverage before launch.

### 2. Cache thrashing during bootstrap

**File:** `partner-os-metadata-bootstrap.service.ts`

The bootstrap service calls `objectMetadataService.findManyWithinWorkspace()` and `fieldMetadataService.findManyWithinWorkspace()` for every object, field, and relation creation. Each call triggers cache invalidation via `getFreshFlatMaps()`. With 16 objects + 100+ fields + relations, this produces **136+ cache invalidation cycles** during a single bootstrap run.

Documented OOM crashes on t3.small instances are likely caused by this pattern.

**Recommendation:** Batch all metadata reads upfront into a single snapshot, perform all mutations, then invalidate cache once at the end. Consider a `bootstrapTransaction` wrapper that defers cache invalidation.

### 3. No rollback mechanism for bootstrap failures

**File:** `partner-os-metadata-bootstrap.service.ts`

If bootstrap fails mid-execution (e.g., after creating 8 of 16 objects), there is no cleanup or rollback logic. The workspace is left with partial schema, and re-running bootstrap may fail on duplicate objects or succeed with orphaned relations.

**Recommendation:** Wrap bootstrap in a database transaction, or implement a `teardown()` method that removes all partner-os objects by a `source: 'partner-os-bootstrap'` tag. At minimum, make every create operation idempotent (check-then-create with conflict handling).

### 4. Remaining user-facing "Twenty" strings (7 locations)

**Files:**
- `SignInUp.tsx` — `Welcome to Twenty`
- `NotFound.tsx` — `Page Not Found | Twenty`
- `FooterNote.tsx` — `By using Twenty, you agree to the`
- `SettingsAIPrompts.tsx` — `managed by Twenty`
- `SyncEmails.tsx` — `Sync your Emails and Calendar with Twenty`
- `getTimelineActivityAuthorFullName.ts` — `'Twenty'` fallback
- `public/manifest.json` — `"name": "Twenty"`, `"short_name": "Twenty"`

**Recommendation:** Fix all 7 before any external user exposure. These are straightforward find-and-replace operations tracked in `docs/fuse-branding-followups.md`.

---

## P1 — High Priority

### 5. Hardcoded legacy rename logic

**File:** `partner-os-schema.constant.ts`

The schema constant contains hardcoded field rename mappings (e.g., `partnerPlay` -> `partnerTrack`) with no migration versioning or documentation explaining when/why renames occurred. If field names change again, the rename chain becomes fragile.

**Recommendation:** Document the rename history in the schema constant file. Consider a versioned migration approach rather than in-place renames if further field evolution is expected.

### 6. No input validation on scoring/discovery services

**Files:** `partner-scoring.service.ts`, `partner-discovery-adapter.service.ts`

Neither service validates inputs before processing:
- Scoring service accepts raw data without type guards or range validation
- Discovery adapter passes external data through without sanitization

**Recommendation:** Add input validation using `isDefined()`, `isNonEmptyString()`, and `isNonEmptyArray()` from `twenty-shared`. Validate scoring inputs are within expected ranges. Sanitize discovery adapter responses before writing to database.

### 7. OAuth token revocation is a no-op

**File:** `packages/twenty-server/src/engine/core-modules/auth/services/oauth.service.ts` (lines 406-421)

The `revokeToken()` method returns success without actually invalidating JWT tokens. A revoked token remains usable until natural expiry. Additionally, `client_id` is optional on the revoke endpoint, allowing unauthenticated callers to probe tokens.

**Recommendation:** Implement a token denylist (Redis-backed, TTL matching token expiry). Require `client_id` on revocation requests. Track in security backlog for hardening before multi-tenant OAuth.

---

## P2 — Medium Priority

### 8. Schema constant file lacks documentation

**File:** `partner-os-schema.constant.ts` (~1,262 lines)

The largest file in the module has no high-level documentation explaining:
- The relationship between CORE, COSELL, and DISCOVERY motion modules
- Default field values and their business rationale
- SELECT option semantics (e.g., scoring tiers, partner stages)

**Recommendation:** Add a block comment at the top explaining the three motion modules and their object relationships. Add inline comments for non-obvious default values.

### 9. Missing ADR and API contract documentation

No Architecture Decision Records (ADRs) exist for:
- Why NestJS module pattern was chosen over workspace-scoped custom objects
- The metadata bootstrap approach vs. migration-based schema evolution
- The scoring algorithm design and its business justification

**Recommendation:** Create `docs/adr/` directory with at minimum: ADR-001 (partner-os architecture), ADR-002 (bootstrap vs migration), ADR-003 (scoring algorithm).

### 10. Bootstrap scripts only as .pyc in some contexts

**File:** `scripts/mcp-bootstrap/`

The Python bootstrap tooling (4 files, ~1,739 lines) exists on `feat/partner-os-schema-spine` but should be verified to have source (.py) committed rather than compiled (.pyc) only.

**Recommendation:** Verify `.gitignore` excludes `__pycache__` and `.pyc` files. Ensure only source `.py` files are tracked.

### 11. OAuth state parameter reflected verbatim

**File:** `packages/twenty-server/src/engine/core-modules/auth/services/auth.service.ts`

The OAuth `state` parameter is reflected into redirect URLs without server-side CSRF binding. While PKCE is now implemented, the `state` parameter should also be validated against a server-side store for defense-in-depth.

**Recommendation:** Generate and store a cryptographic `state` value server-side, validate on callback.

### 12. returnToPath validator bypass potential

**File:** `isValidReturnToPath.ts`

The validator may be bypassable with backslash-encoded paths on certain platforms. Needs fuzzing with edge cases: `\..`, `//evil.com`, `%2F%2F`, etc.

**Recommendation:** Normalize path separators before validation. Add test cases for common bypass patterns.

---

## P3 — Low Priority / Style

### 13. Minor style inconsistencies

- Constant placement: some constants defined inline, others in dedicated files
- Type exports: inconsistent between `export type` and re-exports via barrel files
- Import ordering: some files mix `@/` and relative imports inconsistently

### 14. Storybook mock data still references "Twenty"

**File:** `packages/twenty-front/src/pages/auth/__stories__/SignInUpWithInvite.stories.tsx`

Mock data uses `displayName: 'Twenty dev'`. Low priority since it's only visible in Storybook.

### 15. Placeholder brand assets need replacement

**Files:**
- `packages/twenty-front/public/images/integrations/fuse-logo.svg`
- `packages/twenty-front/public/images/integrations/fuse-logo-dark.svg`
- `packages/twenty-front/public/images/icons/fuse-favicon.svg`

These are geometric placeholder SVGs. Final brand assets needed before public launch.

---

## Architecture Notes

### Partner-OS Module Design

The module follows NestJS patterns correctly:
- `partner-os.module.ts` registers services with proper dependency injection
- Services use constructor injection and repository pattern
- Types are properly separated in `types/` directory

The bootstrap approach (runtime schema stamping via metadata API) is pragmatic for MVP but carries risks:
- Tighter coupling to Twenty's internal metadata API than database migrations would have
- No compile-time guarantees on schema shape
- Cache invalidation overhead during bootstrap

For v2, consider migrating to TypeORM entity definitions with standard database migrations.

### MCP Bootstrap Architecture

The Python MCP bootstrap tooling is well-structured:
- `bootstrap.py` (orchestration) -> `mcp_client.py` (API layer) -> `schema_modules.py` (definitions)
- Supports dry-run, checkpointing, and idempotent re-runs
- Three motion modules (CORE: 3 objects, COSELL: 4 objects, DISCOVERY: 7 objects)
- Total: 16 custom objects for the partner-os domain

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| P0 | 4 | Must fix before launch |
| P1 | 3 | High priority |
| P2 | 5 | Medium, schedule for hardening sprint |
| P3 | 3 | Low, address opportunistically |

**Critical path:** Items 1-4 (test coverage, cache thrashing, rollback mechanism, branding strings) are launch blockers. Item 7 (OAuth revocation) is a launch blocker for multi-tenant deployments.
