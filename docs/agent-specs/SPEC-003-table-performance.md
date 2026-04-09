# SPEC-003: Table Performance Optimization

## Context

Twenty's record table renders slowly with many records. The root cause is NOT
the virtualization layer (the "treadmill" works correctly) but the per-cell
component depth and redundant hook calls.

Twenty's own internal audit found:
- 14 components per cell from `RecordTableCell` to rendered text
- 31 total component instances from `RecordTable` root to a text value
- 12,400+ component instances for a 50-row x 8-column table
- Every cell independently calls `useObjectMetadataItems()` (heavy context lookup)
- Every cell attaches its own mouse/click event handlers (no delegation)

The upstream fix branch (`upstream/table-perf`) exists but is NOT merged to
`twentyhq/twenty:main`. These fixes are safe to take independently of the
Linaria migration, but the Linaria cherry-pick (SPEC-001 Block 2) should land
first to avoid double-rebasing the frontend.

## Treadmill Virtualization (existing, working)

The table uses a hand-rolled windowing system — not `react-window` or
`react-virtuoso`. Key file:

```
packages/twenty-front/src/modules/object-record/record-table/virtualization/hooks/useProcessTreadmillScrollTop.ts
```

How it works:
- 200 DOM rows are recycled (never created/destroyed during scroll)
- Each row has a `virtualIndex` (0-199) and a `realIndex` (position in data)
- Scroll events trigger `processScrollTop()` which maps scroll position to
  the correct `realIndex` window via modular arithmetic
- Jotai atom families (`virtualRowToRealRowMap`) store the virtual→real mapping
- Rows read their real index from the atom and render the corresponding record

This layer is correct and performant. Do not rewrite it.

## Problem: Per-Cell Overhead

The render path from `RecordTableCell` to visible text:

```
RecordTableCell
  → RecordTableCellContainer
    → RecordTableCellDisplayContainer
      → RecordTableCellFieldContextProvider   ← useObjectMetadataItems() here
        → FieldDisplay
          → TextFieldDisplay (or variant)
            → EllipsisDisplay
              → StyledText
                → <span>
```

Each of the ~400 visible cells (50 rows x 8 cols) independently:
1. Calls `useObjectMetadataItems()` — traverses full metadata context
2. Attaches `onMouseEnter`, `onClick`, `onContextMenu` handlers
3. Renders 14 intermediate wrapper components

## Fix 1: Hoist `useObjectMetadataItems()`

**What:** Move the `useObjectMetadataItems()` call from per-cell to per-table.
Pass the resolved metadata down via context or props.

**Where:**
```
packages/twenty-front/src/modules/object-record/record-table/components/RecordTable.tsx
```

**Pattern:**
```typescript
// BEFORE (in each RecordTableCellFieldContextProvider):
const { objectMetadataItems } = useObjectMetadataItems();

// AFTER (in RecordTable, passed via context):
const { objectMetadataItems } = useObjectMetadataItems();
// Provide via React context to all cells
<ObjectMetadataContext.Provider value={objectMetadataItems}>
  {/* table body */}
</ObjectMetadataContext.Provider>

// In each cell, replace the hook call with context read:
const objectMetadataItems = useContext(ObjectMetadataContext);
```

**Impact:** Eliminates ~400 redundant context traversals per render. This is
the single highest-impact fix.

**Files to modify:**
- `RecordTable.tsx` — add context provider
- `RecordTableCellFieldContextProvider.tsx` — consume context instead of hook
- Create `ObjectMetadataTableContext.ts` — new context definition

**Risk:** Low. The data is identical — only the access pattern changes.

## Fix 2: Event Delegation

**What:** Replace per-cell `onMouseEnter`/`onClick`/`onContextMenu` handlers
with a single delegated handler on the table body. Use `data-*` attributes to
identify which cell was targeted.

**Where:**
```
packages/twenty-front/src/modules/object-record/record-table/components/RecordTableBody.tsx
packages/twenty-front/src/modules/object-record/record-table/record-table-cell/components/RecordTableCell.tsx
```

**Pattern:**
```typescript
// BEFORE (per cell):
<td
  onMouseEnter={() => setHoveredCell(cellId)}
  onClick={() => openCell(cellId)}
  onContextMenu={(e) => openContextMenu(e, cellId)}
>

// AFTER (on table body, delegated):
<tbody
  onMouseEnter={(e) => {
    const cell = (e.target as HTMLElement).closest('[data-cell-id]');
    if (cell) setHoveredCell(cell.dataset.cellId);
  }}
  onClick={(e) => {
    const cell = (e.target as HTMLElement).closest('[data-cell-id]');
    if (cell) openCell(cell.dataset.cellId);
  }}
>
  {/* cells only need data-cell-id="..." */}
```

**Impact:** Removes ~1,200 event listener registrations (400 cells x 3 events).
Reduces GC pressure and speeds up initial render.

**Files to modify:**
- `RecordTableBody.tsx` — add delegated handlers
- `RecordTableCell.tsx` — remove per-cell handlers, add `data-cell-id`
- `RecordTableCellContainer.tsx` — remove handler props

**Risk:** Low. Event delegation is a well-established pattern. The `closest()`
lookup adds negligible overhead compared to 1,200 listeners.

## Fix 3: React.memo on Cell Components (Optional, P2)

**What:** Add `React.memo()` to `RecordTableCellDisplayContainer` and
`FieldDisplay` with shallow comparison on the record data + field metadata.

**Why optional:** Fixes 1 and 2 address the dominant costs. Memoization adds
value only if parent re-renders frequently without cell data changing (e.g.,
hover state changes causing full table re-render).

**Pattern:**
```typescript
export const RecordTableCellDisplayContainer = React.memo(
  function RecordTableCellDisplayContainer({ record, fieldMetadata }: Props) {
    // existing render logic
  }
);
```

## Execution Order

1. Land Linaria cherry-pick (SPEC-001 Block 2) — avoids style conflicts
2. Fix 1: Hoist `useObjectMetadataItems()` (~30 lines changed)
3. Fix 2: Event delegation (~40 lines changed)
4. Measure: Profile with React DevTools Profiler on a 200-record table
5. Fix 3: `React.memo` only if profiling shows unnecessary re-renders

## Verification

### Before (baseline)
```bash
# Open React DevTools Profiler
# Navigate to a table view with 100+ records
# Record a scroll interaction
# Note: render count per cell, total render time
```

### After
```bash
# Same profiling session
# Expected: ~400 fewer hook calls per render cycle
# Expected: ~1200 fewer event listeners in Chrome DevTools → Performance → Event Listeners
# Expected: visible improvement in scroll jank on t3.small instance
```

### Automated
```bash
npx nx test twenty-front -- --testPathPattern="record-table"
npx nx typecheck twenty-front
npx nx lint:diff-with-main twenty-front
```

## Acceptance Criteria

- [ ] `useObjectMetadataItems()` is called once per table, not per cell
- [ ] Event handlers are delegated at `<tbody>` level, not per `<td>`
- [ ] All existing record-table tests pass
- [ ] No TypeScript errors introduced
- [ ] Scroll performance visibly improved on 100+ record tables

## Guard Rails

- Do NOT rewrite the treadmill virtualization. It works correctly.
- Do NOT introduce `react-window` or `react-virtuoso`. The custom system is
  tightly integrated with Jotai state and Twenty's selection model.
- Do NOT change the virtual→real index mapping logic.
- Keep changes to the cell render path only. Do not refactor table headers,
  row selection, or drag-to-reorder.
- Test with both small (10 records) and large (500+ records) datasets.
