<<<<<<<< HEAD:packages/twenty-front/src/modules/object-metadata/components/WorkspaceSectionItemContentProps.ts
import type { NavigationMenuItemClickParams } from '@/navigation-menu-item/hooks/useWorkspaceSectionItems';
========
import type { ReactNode } from 'react';

import type { NavigationMenuItemClickParams } from '@/navigation-menu-item/display/hooks/useNavigationMenuItemSectionItems';
>>>>>>>> 9f7c29bce8 (refactor(twenty-front): unify Favorites and Workspace navigation menu item code (#18697)):packages/twenty-front/src/modules/navigation-menu-item/display/sections/types/NavigationMenuItemSectionContentProps.ts
import type { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import type { NavigationMenuItem } from '~/generated-metadata/graphql';

import type { EditModeProps } from '@/object-metadata/components/EditModeProps';

export type NavigationMenuItemSectionContentProps = {
  item: NavigationMenuItem;
  isEditInPlace?: boolean;
  editModeProps?: EditModeProps;
  isDragging: boolean;
  folderChildrenById: Map<string, NavigationMenuItem[]>;
  folderCount: number;
  rightOptions?: ReactNode;
  selectedNavigationMenuItemId?: string | null;
  onNavigationMenuItemClick?: (params: NavigationMenuItemClickParams) => void;
  onActiveObjectMetadataItemClick?: (
    objectMetadataItem: ObjectMetadataItem,
    navigationMenuItemId: string,
  ) => void;
  readOnly?: boolean;
};
