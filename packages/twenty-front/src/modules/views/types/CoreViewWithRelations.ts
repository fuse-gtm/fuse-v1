// Compatibility shim: Fuse partner-os code expected "Core"-prefixed view types
// that were planned but never committed. These types are structurally identical
// to the canonical `ViewWithRelations` family, so we alias them.
//
// TODO(wave-3-cleanup): migrate consumers to import the non-prefixed types directly.

export type {
  ViewWithRelations as CoreViewWithRelations,
  ViewFieldEssential as CoreViewFieldEssential,
  ViewFieldGroupEssential as CoreViewFieldGroupEssential,
} from '@/views/types/ViewWithRelations';

// Extended aliases (wave-2 consumers expect these on top of the 3 already exported).
import { type View } from '@/views/types/View';
import { type ViewWithRelations } from '@/views/types/ViewWithRelations';
export type CoreViewFilter = NonNullable<View['viewFilters']>[number];
export type CoreViewFilterGroup = NonNullable<View['viewFilterGroups']>[number];
export type CoreViewSort = NonNullable<View['viewSorts']>[number];
export type CoreViewGroup = NonNullable<View['viewGroups']>[number];
export type CoreViewField = NonNullable<View['viewFields']>[number];
export type CoreViewEssential = Pick<ViewWithRelations, 'id' | 'name' | 'key'>;
