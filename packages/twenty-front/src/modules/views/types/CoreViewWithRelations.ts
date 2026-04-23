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
