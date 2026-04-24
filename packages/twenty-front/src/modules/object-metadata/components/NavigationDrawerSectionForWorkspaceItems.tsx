// Dead-symbol stub: the Fuse-specific NavigationDrawerSection* tree was left
// in a broken state by wave-2 cherry-pick conflict resolution (upstream #18697
// unified Favorites+Workspace DnD, moved components to
// navigation-menu-item/display/sections/workspace/). The HEAD-side of the
// conflict had dangling imports (styled, NavigationDrawerSection,
// NavigationDrawerSectionTitle, NavigationDrawerAnimatedCollapseWrapper,
// AnimatedExpandableContainer all undefined) and a mix of old+new symbol
// names. Rather than surgically repair ~200 lines of corrupted JSX for a
// component consumers can turn off via feature flag, we stub it.
//
// At runtime this section renders nothing. When the navigation-menu-item
// edit-mode feature is actually turned on in prod, this stub must be
// replaced with real logic (likely by switching consumers to import from
// @/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionContainer
// which is the upstream canonical component).
//
// TODO(wave-3-cleanup): replace with a real implementation or migrate
// consumers to the canonical upstream path.

import { type NavigationMenuItem } from '~/generated-metadata/graphql';
import type { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';

type NavigationMenuItemClickParams = {
  item: NavigationMenuItem;
  objectMetadataItem?: ObjectMetadataItem;
};

type NavigationDrawerSectionForWorkspaceItemsProps = {
  sectionTitle: string;
  items: NavigationMenuItem[];
  rightIcon?: React.ReactNode;
  selectedNavigationMenuItemId?: string | null;
  onNavigationMenuItemClick?: (params: NavigationMenuItemClickParams) => void;
  onActiveObjectMetadataItemClick?: (
    objectMetadataItem: ObjectMetadataItem,
    navigationMenuItemId: string,
  ) => void;
};

export const NavigationDrawerSectionForWorkspaceItems = (
  _props: NavigationDrawerSectionForWorkspaceItemsProps,
): JSX.Element | null => null;
