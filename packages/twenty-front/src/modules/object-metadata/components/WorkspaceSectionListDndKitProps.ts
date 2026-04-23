<<<<<<<< HEAD:packages/twenty-front/src/modules/object-metadata/components/WorkspaceSectionListDndKitProps.ts
import type { NavigationMenuItemClickParams } from '@/navigation-menu-item/hooks/useWorkspaceSectionItems';
========
import type { NavigationMenuItemClickParams } from '@/navigation-menu-item/display/hooks/useNavigationMenuItemSectionItems';
>>>>>>>> 9f7c29bce8 (refactor(twenty-front): unify Favorites and Workspace navigation menu item code (#18697)):packages/twenty-front/src/modules/navigation-menu-item/display/sections/types/NavigationMenuItemSectionListDndKitProps.ts
import type { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import type { NavigationMenuItem } from '~/generated-metadata/graphql';

import type { EditModeProps } from '@/object-metadata/components/EditModeProps';

export type NavigationMenuItemSectionListDndKitProps = {
  filteredItems: NavigationMenuItem[];
  getEditModeProps: (item: NavigationMenuItem) => EditModeProps;
  folderChildrenById: Map<string, NavigationMenuItem[]>;
  selectedNavigationMenuItemId: string | null;
  onNavigationMenuItemClick?: (params: NavigationMenuItemClickParams) => void;
  onActiveObjectMetadataItemClick?: (
    objectMetadataItem: ObjectMetadataItem,
    navigationMenuItemId: string,
  ) => void;
};
