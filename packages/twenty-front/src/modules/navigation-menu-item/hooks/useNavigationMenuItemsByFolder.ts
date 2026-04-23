// Compatibility shim: canonical hook lives at display/folder/hooks/ (upstream
// #18691 module reorg into common/display/edit). Consumers at the flat
// navigation-menu-item/hooks/ path still import via relative `./`.
// TODO(wave-3-cleanup): update consumers.
export { useNavigationMenuItemsByFolder } from '@/navigation-menu-item/display/folder/hooks/useNavigationMenuItemsByFolder';
