# FUSE-200 Sidebar Slice: Edit Cycle Evidence

**Date:** 2026-03-02T07:00:00Z
**Workspace:** `06e070b2-80eb-4097-8813-8d2ebe632108` (Fuse-Test)
**Image:** `ghcr.io/fuse-gtm/fuse-v1:partner-os-45e979039d` (pre-nav-backfill)
**Method:** Database queries via EC2 Instance Connect + Docker exec

---

## Pre-Condition: Sidebar State Audit

### Workspace-Level Nav Items (10 total)

| Position | Object | Color | Type |
|----------|--------|-------|------|
| 0 | workflow | gray | TABLE |
| 0 | company | blue | TABLE |
| 1 | person | blue | TABLE |
| 1 | workflowRun | gray | TABLE |
| 2 | workflowVersion | gray | TABLE |
| 2 | opportunity | red | TABLE |
| 3 | task | turquoise | TABLE |
| 4 | note | turquoise | TABLE |
| 5 | dashboard | gray | TABLE |
| 6 | Workflows (folder) | orange | n/a |

**Note:** 10 items vs. expected 7 standard items. Workflow, workflowRun, workflowVersion are additional objects created by Twenty's workflow engine. Position duplicates (0,0,1,1,2,2) are present — this is normal for Twenty's flat position model where workspace-level items share a position space.

### Partner-OS Objects: 0
Bootstrap has not yet created the 16 custom partner-os objects on this workspace. This confirms the deployed image (`partner-os-45e979039d`) predates the nav-backfill commit, and the bootstrap command needs to run after deploying the new image (`partner-os-ca148b73d2`).

### Feature Flags Seeded
4 missing flags were inserted to enable sidebar editing:

| Flag | Value | Purpose |
|------|-------|---------|
| IS_NAVIGATION_MENU_ITEM_ENABLED | true | Enables nav menu item system |
| IS_NAVIGATION_MENU_ITEM_EDITING_ENABLED | true | Enables drag-and-drop reorder, color, add/remove |
| IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED | true | Enables page layout tab editing |
| IS_AI_ENABLED | true | Enables AI agent/chat features |

Total flags after seed: 12 (up from 8).

### Application ID Consistency
All nav items share a single `applicationId`: `1868ff36-a5cf-42f2-af91-c835d0949290` — no cross-application contamination.

### User-Level Nav Items: 0
No per-user customizations exist. All items are workspace-level (`userWorkspaceId = NULL`).

---

## Edit Cycle: Write-and-Revert

### Test 1: Reorder
- **Action:** Moved "Company" from position 0 to position 4
- **Result:** PASS — position updated, other items maintained positions
- **Verification:** Query confirmed Company at position 4 in AFTER snapshot

### Test 2: Color Change
- **Action:** Changed "Company" color from `blue` to `green`
- **Result:** PASS — color field updated
- **Verification:** Query confirmed `color=green` in AFTER snapshot

### Test 3: Revert
- **Action:** Restored "Company" to position 0, color `blue`
- **Result:** PASS — state matches BEFORE snapshot exactly
- **Verification:** Full nav item list matches pre-edit state

### Persistence
- All edits persisted across separate TypeORM connections (each query creates a new connection via DataSource)
- No cache invalidation required — changes visible immediately on re-query
- GraphQL metadata endpoint (`/metadata`) responds correctly: `{"data":{"__typename":"Query"}}`

---

## Verdict

| Capability | Status | Notes |
|------------|--------|-------|
| Nav items exist | PASS | 10 workspace-level items |
| Reorder (position write) | PASS | Write-and-revert validated |
| Color change | PASS | Write-and-revert validated |
| Feature flags for editing | PASS | 4 flags seeded |
| Application ID consistency | PASS | Single application ID |
| GraphQL API reachable | PASS | `/metadata` responds |
| Partner-OS objects in sidebar | BLOCKED | Requires new image deploy + bootstrap |
| UI-level edit verification | BLOCKED | No browser automation MCP connected |

### Sidebar Slice Status: **CONDITIONAL PASS**

The sidebar data layer (CRUD on `core.navigationMenuItem`) is fully functional. Write-and-revert validated at the database level. Feature flags are seeded for editing UI.

**Remaining for full PASS:**
1. Deploy new image with nav-backfill code (`partner-os-ca148b73d2`)
2. Run bootstrap to create 16 partner-os objects + nav items
3. UI-level verification (manual or browser automation) of reorder/color/add/remove in the app

---

## Next Actions
- [ ] Complete Docker image build and push
- [ ] Deploy `partner-os-ca148b73d2` to production
- [ ] Run `workspace:bootstrap:partner-os -w "06e070b2-80eb-4097-8813-8d2ebe632108"`
- [ ] Verify sidebar shows 26+ nav items (10 current + 16 partner-os)
- [ ] UI edit cycle in browser
- [ ] Update slice status to PASS
