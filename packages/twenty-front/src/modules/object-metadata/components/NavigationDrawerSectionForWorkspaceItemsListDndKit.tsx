<<<<<<<< HEAD:packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForWorkspaceItemsListDndKit.tsx
import { WorkspaceDndKitDroppableSlot } from '@/navigation-menu-item/components/WorkspaceDndKitDroppableSlot';
import { WorkspaceDndKitSortableItem } from '@/navigation-menu-item/components/WorkspaceDndKitSortableItem';
import { NavigationMenuItemDroppableIds } from '@/navigation-menu-item/constants/NavigationMenuItemDroppableIds';
========
import { NavigationMenuItemDroppableSlot } from '@/navigation-menu-item/display/dnd/components/NavigationMenuItemDroppableSlot';
import { NavigationMenuItemSortableItem } from '@/navigation-menu-item/display/dnd/components/NavigationMenuItemSortableItem';
import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { NavigationMenuItemDroppableIds } from '@/navigation-menu-item/common/constants/NavigationMenuItemDroppableIds';
>>>>>>>> 9f7c29bce8 (refactor(twenty-front): unify Favorites and Workspace navigation menu item code (#18697)):packages/twenty-front/src/modules/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionListDndKit.tsx
import { NavigationMenuItemType } from 'twenty-shared/types';
import { NavigationDropTargetContext } from '@/navigation-menu-item/contexts/NavigationDropTargetContext';
import { useIsDropDisabledForSection } from '@/navigation-menu-item/hooks/useIsDropDisabledForSection';
import { isNavigationMenuInEditModeState } from '@/navigation-menu-item/states/isNavigationMenuInEditModeState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { useContext } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

<<<<<<<< HEAD:packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForWorkspaceItemsListDndKit.tsx
import { NavigationMenuItemDragContext } from '@/navigation-menu-item/contexts/NavigationMenuItemDragContext';
import { NavigationDrawerSectionForWorkspaceItemContent } from '@/object-metadata/components/NavigationDrawerSectionForWorkspaceItemContent';
import { WorkspaceOrphanDropTarget } from '@/object-metadata/components/WorkspaceOrphanDropTarget';
import { WorkspaceSectionAddMenuItemButton } from '@/object-metadata/components/WorkspaceSectionAddMenuItemButton';
import type { WorkspaceSectionListDndKitProps } from '@/object-metadata/components/WorkspaceSectionListDndKitProps';
========
import { NavigationMenuItemDragContext } from '@/navigation-menu-item/common/contexts/NavigationMenuItemDragContext';
import { NavigationMenuItemDisplay } from '@/navigation-menu-item/display/components/NavigationMenuItemDisplay';
import { NavigationMenuItemOrphanDropTarget } from '@/navigation-menu-item/display/sections/components/NavigationMenuItemOrphanDropTarget';
import { WorkspaceSectionAddMenuItemButton } from '@/navigation-menu-item/edit/components/WorkspaceSectionAddMenuItemButton';
import type { NavigationMenuItemSectionListDndKitProps } from '@/navigation-menu-item/display/sections/types/NavigationMenuItemSectionListDndKitProps';

type WorkspaceSectionListDndKitProps = NavigationMenuItemSectionListDndKitProps;
>>>>>>>> 9f7c29bce8 (refactor(twenty-front): unify Favorites and Workspace navigation menu item code (#18697)):packages/twenty-front/src/modules/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionListDndKit.tsx

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.betweenSiblingsGap};
  padding-top: ${themeCssVariables.betweenSiblingsGap};
`;

const StyledListItemRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const WorkspaceSectionListDndKit = ({
  filteredItems,
  getEditModeProps,
  folderChildrenById,
  selectedNavigationMenuItemId,
  onNavigationMenuItemClick,
  onActiveObjectMetadataItemClick,
}: WorkspaceSectionListDndKitProps) => {
  const isNavigationMenuInEditMode = useAtomStateValue(
    isNavigationMenuInEditModeState,
  );
  const workspaceDropDisabled = useIsDropDisabledForSection(true);
  const { isDragging } = useContext(NavigationMenuItemDragContext);
  const { addToNavigationFallbackDestination } = useContext(
    NavigationDropTargetContext,
  );
  const folderCount = filteredItems.filter(
    (item) => item.type === NavigationMenuItemType.FOLDER,
  ).length;
  const isAddMenuItemButtonVisible = isNavigationMenuInEditMode;
  return (
    <StyledList>
      {filteredItems.map((item, index) => (
        <StyledListItemRow key={item.id}>
          <NavigationMenuItemOrphanDropTarget index={index} compact />
          <NavigationMenuItemSortableItem
            id={item.id}
            index={index}
            group={
              NavigationMenuItemDroppableIds.WORKSPACE_ORPHAN_NAVIGATION_MENU_ITEMS
            }
            disabled={!isNavigationMenuInEditMode || workspaceDropDisabled}
          >
            <NavigationDrawerSectionForWorkspaceItemContent
              item={item}
              editModeProps={getEditModeProps(item)}
              isDragging={isDragging}
              folderChildrenById={folderChildrenById}
              folderCount={folderCount}
              selectedNavigationMenuItemId={selectedNavigationMenuItemId}
              onNavigationMenuItemClick={onNavigationMenuItemClick}
              onActiveObjectMetadataItemClick={onActiveObjectMetadataItemClick}
            />
          </NavigationMenuItemSortableItem>
        </StyledListItemRow>
      ))}
      <NavigationMenuItemDroppableSlot
        droppableId={
          NavigationMenuItemDroppableIds.WORKSPACE_ORPHAN_NAVIGATION_MENU_ITEMS
        }
        index={filteredItems.length}
        disabled={workspaceDropDisabled}
      >
        <NavigationMenuItemOrphanDropTarget
          index={filteredItems.length}
          compact={!isAddMenuItemButtonVisible}
        >
          {isAddMenuItemButtonVisible && <WorkspaceSectionAddMenuItemButton />}
        </NavigationMenuItemOrphanDropTarget>
      </NavigationMenuItemDroppableSlot>
      {addToNavigationFallbackDestination?.droppableId ===
        NavigationMenuItemDroppableIds.WORKSPACE_ORPHAN_NAVIGATION_MENU_ITEMS &&
        addToNavigationFallbackDestination.index > filteredItems.length && (
          <NavigationMenuItemDroppableSlot
            droppableId={
              NavigationMenuItemDroppableIds.WORKSPACE_ORPHAN_NAVIGATION_MENU_ITEMS
            }
            index={addToNavigationFallbackDestination.index}
            disabled={workspaceDropDisabled}
          >
            <NavigationMenuItemOrphanDropTarget
              index={addToNavigationFallbackDestination.index}
              compact
            />
          </NavigationMenuItemDroppableSlot>
        )}
    </StyledList>
  );
};
