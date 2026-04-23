# Wave 2A Security — Skipped Cherry-picks (CTO Follow-up Backlog)

**Context:** Wave 2A executor successfully cherry-picked 18 of 23 `2A-security` ledger rows onto `integration/upstream-wave2-security` (PR #15). The following 5 commits were **skipped for content reasons** — not classification errors. They need re-triage with dedicated conflict-resolution planning before merging into Fuse main.

**Status when opened:** 2026-04-23, wave 2A PR #15 pending merge. 2A executor flagged these for CTO follow-up in its `DONE_WITH_CONCERNS` report.

---

## Skipped commits

### 1. `4ea2e32366` — SDK refactor (ROOT BLOCKER for items 2–3)

**Title:** upstream SDK refactor — file moves / deletes / adds across `twenty-client-sdk`, `upgrade-version-command`, `twenty-apps/hello-world` → `examples/hello-world`

**Skip reason:** 30+ file conflict with file moves/deletions/add-adds. Too large for safe auto-resolve. The commit is mis-classified as `2A-security` in the ledger — it's actually an SDK restructuring commit that happened to touch security-adjacent workflow files.

**Blocks:** Items 2 and 3 below depend on this landing.

**Recommended action:** Either (a) re-triage as `2B-backend` or `defer` and handle in a dedicated SDK-refactor batch with manual conflict resolution, or (b) skip permanently if Fuse doesn't need SDK CLI tooling refactor. The SDK is used for the `@twenty/sdk` npm package — check whether Fuse consumers depend on the new layout.

**Risk of permanent skip:** Low — the SDK move is organizational, not a functional change. Future upstream SDK commits may keep piling conflicts until this is resolved.

---

### 2. `c26c0b9d71` — depends on item 1

**Title:** (follow-up to `4ea2e32366` — references deleted `dev-once.ts`)

**Skip reason:** Can't apply without its parent SDK refactor commit.

**Recommended action:** Re-triage alongside item 1.

---

### 3. `baf2fc4cc9` — depends on item 1

**Title:** (follow-up to `4ea2e32366` — same deletion dependency)

**Skip reason:** Same as item 2.

**Recommended action:** Re-triage alongside item 1.

---

### 4. `75848ff8ea` — admin-panel migration

**Title:** 70-file / 4,700-line admin-panel migration

**Skip reason:** Fuse has **deliberately deleted admin-panel UIs** that this upstream commit modifies. Auto-resurrecting would undo Fuse sovereignty deletions. This is the most sensitive skip — it requires a CTO decision on whether Fuse wants the admin-panel UX changes that came with later upstream work.

**Recommended action:** Review what specifically was deleted in Fuse vs what upstream is trying to migrate. Three outcomes possible:
- **Keep skipped** — Fuse intentionally removed admin panel; don't re-introduce.
- **Cherry-pick selectively** — take the non-admin-panel portions of the commit (requires surgical resolve).
- **Reverse direction** — if upstream admin panel added features Fuse wants, re-enable admin panel on a Fuse fork branch and pull this in.

**Risk of permanent skip:** Medium-High — future upstream commits that touch admin panel will pile conflicts here. If we keep skipping, the admin-panel delta between Fuse and upstream grows.

---

### 5. `2a5b2746c9` — empty after prior resolve

**Title:** (companion fix to commit #1 `0223975bbd`)

**Skip reason:** The 2A executor's conflict resolution on `0223975bbd` (GitHub Actions injection fixes) already merged this commit's content. When cherry-pick ran, `git` reported "empty commit — nothing to commit". Executor correctly skipped.

**Recommended action:** None. This is a true no-op. Close as "already applied via upstream combined-PR resolution".

---

## Summary

| Item | SHA | True cause | Next step |
|---|---|---|---|
| 1 | `4ea2e32366` | SDK refactor misclassified as security | Re-triage to backend or defer |
| 2 | `c26c0b9d71` | Depends on #1 | Re-triage with #1 |
| 3 | `baf2fc4cc9` | Depends on #1 | Re-triage with #1 |
| 4 | `75848ff8ea` | Admin-panel sovereignty deletion | CTO decision |
| 5 | `2a5b2746c9` | Content already applied | Close as no-op |

**Net open CTO decisions:** 2 (the SDK-refactor batch, the admin-panel direction).

**Priority:** Low — wave 2A is genuine security hardening (SSRF, XSS, PKCE, OAuth RFC 9728, dep-bump CVEs). These 5 skips are not themselves security-critical; the critical security fixes landed.
