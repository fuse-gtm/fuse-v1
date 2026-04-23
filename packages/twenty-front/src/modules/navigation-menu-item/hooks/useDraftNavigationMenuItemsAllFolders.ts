// Compatibility shim: path moved to @/navigation-menu-item/edit/hooks/useDraftNavigationMenuItemsAllFolders in upstream refactor #18691.
// Fuse consumers still import from the old path; this re-export keeps them working.
// TODO(wave-3-cleanup): migrate consumers to the canonical import path.
export * from '@/navigation-menu-item/edit/hooks/useDraftNavigationMenuItemsAllFolders';
