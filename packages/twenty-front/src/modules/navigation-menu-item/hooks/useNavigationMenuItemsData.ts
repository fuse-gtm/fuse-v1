// Dead-symbol stub: Fuse-specific data hook planned but never committed.
// TODO(wave-3-cleanup): implement or remove consumers.
// Returns empty arrays so consumer logic can iterate without errors.
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

export const useNavigationMenuItemsData = (): {
  navigationMenuItems: NavigationMenuItem[];
  workspaceNavigationMenuItems: NavigationMenuItem[];
} => ({
  navigationMenuItems: [],
  workspaceNavigationMenuItems: [],
});
