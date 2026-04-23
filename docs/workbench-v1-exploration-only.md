# Workbench V1 — Exploration Only (Not Shipping)

**Status:** EXPLORATION ONLY. Not part of the active roadmap. Do not cherry-pick, merge, or re-activate without explicit founder decision.

**Date marked:** 2026-04-23
**Decided by:** Dhruv (CTO)

## What existed

Prototype of a discovery workspace (search companies via Exa, review evidence, save to datasets) lived on `codex/workbench-v1-impl-pre-restack-20260409`. Four commits:

- `7294679942` feat: add workbench backend spine
- `45abd98a5e` feat: gate workbench backend behind workspace allowlist
- `8e5c9aa8d4` feat: add hidden workbench search loop frontend
- `7a3fe790a1` feat: add hidden workbench review and dataset flow

Snapshot: `codex/workbench-v1-snapshot-20260407` (`fa62af02e1` wip: snapshot prototype state before extraction).

Backend spine: 7 entities, 9 enums, 3 DTOs, 3 services, 2 controllers, 30 unit tests, cell-envelope truth model, HMAC webhook verification, idempotency index.

## Why it is not shipping

- Was always gated behind a workspace allowlist — no production users rely on it.
- Integrating would pull Exa Websets dependency, Glide Data Grid, and a new truth model into a codebase that is already 1,221 commits behind upstream Twenty.
- Founder decision: focus on upstream sync + partner-os hardening first. Workbench was an exploration of a future surface, not a commitment.

## Do not

- Do not cherry-pick workbench commits onto `main`.
- Do not merge `codex/workbench-v1-impl-pre-restack-20260409`.
- Do not reference workbench in upstream-sync ledgers or deploy plans.
- Do not restart workbench work under a different branch name without re-opening the decision.

## What to do with the branches

Leave `codex/workbench-v1-impl-pre-restack-20260409` and `codex/workbench-v1-snapshot-20260407` in place as historical references. Mark this doc as the canonical status so a future agent reading the branch name does not assume in-progress work.

## Related memory that is now stale

The following memory entries reference workbench as active. They should be treated as stale until explicitly revived:

- `~/.claude/projects/-Users-dhruvraina-fuse-platform/memory/workbench-v1-progress.md`
- `~/.claude/projects/-Users-dhruvraina-fuse-platform/memory/workbench-v1-build-plan-snapshot.md`
- `~/.claude/projects/-Users-dhruvraina-fuse-platform/memory/feedback-workbench-v1-plan.md`
- `~/.claude/projects/-Users-dhruvraina-fuse-platform/memory/exa-websets-api.md` (only relevant when/if workbench revives)
- `~/.claude/projects/-Users-dhruvraina-fuse-platform/memory/glide-data-grid-patterns.md` (only relevant when/if workbench revives)
