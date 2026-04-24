// Compatibility shim: upstream #18697 unified DnDKit components into
// navigation-menu-item/display/dnd/. `WorkspaceDndKit*` was renamed to
// `NavigationMenuItemDndKit*` (but the canonical component is named
// `NavigationMenuItemDroppableSlot`).
// TODO(wave-3-cleanup): migrate consumers.
export {
  FOLDER_HEADER_SLOT_COLLISION_PRIORITY,
  NavigationMenuItemDroppableSlot as WorkspaceDndKitDroppableSlot,
} from '@/navigation-menu-item/display/dnd/components/NavigationMenuItemDroppableSlot';
