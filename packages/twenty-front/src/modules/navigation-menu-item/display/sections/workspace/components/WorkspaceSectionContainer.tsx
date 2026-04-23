<<<<<<<< HEAD:packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForWorkspaceItems.tsx
import { NavigationDropTargetContext } from '@/navigation-menu-item/contexts/NavigationDropTargetContext';
========
import { styled } from '@linaria/react';
>>>>>>>> 9f7c29bce8 (refactor(twenty-front): unify Favorites and Workspace navigation menu item code (#18697)):packages/twenty-front/src/modules/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionContainer.tsx
import React, { lazy, Suspense, useContext } from 'react';
import { NavigationMenuItemType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

<<<<<<<< HEAD:packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForWorkspaceItems.tsx
import { NavigationMenuItemDroppableIds } from '@/navigation-menu-item/constants/NavigationMenuItemDroppableIds';
import { type NavigationMenuItemClickParams } from '@/navigation-menu-item/hooks/useWorkspaceSectionItems';
import { isNavigationMenuInEditModeState } from '@/navigation-menu-item/states/isNavigationMenuInEditModeState';
import { getObjectMetadataForNavigationMenuItem } from '@/navigation-menu-item/utils/getObjectMetadataForNavigationMenuItem';
import type { EditModeProps } from '@/object-metadata/components/EditModeProps';
import { NavigationDrawerSectionForWorkspaceItemsListReadOnly } from '@/object-metadata/components/NavigationDrawerSectionForWorkspaceItemsListReadOnly';
========
import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { NavigationMenuItemDroppableIds } from '@/navigation-menu-item/common/constants/NavigationMenuItemDroppableIds';
import { NavigationDropTargetContext } from '@/navigation-menu-item/common/contexts/NavigationDropTargetContext';
import { type NavigationMenuItemClickParams } from '@/navigation-menu-item/display/hooks/useNavigationMenuItemSectionItems';
import { getObjectMetadataForNavigationMenuItem } from '@/navigation-menu-item/display/object/utils/getObjectMetadataForNavigationMenuItem';
import { WorkspaceSectionListReadOnly } from '@/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionListReadOnly';
import { NavigationMenuItemSection } from '@/navigation-menu-item/display/sections/components/NavigationMenuItemSection';
import type { EditModeProps } from '@/object-metadata/components/EditModeProps';
>>>>>>>> 9f7c29bce8 (refactor(twenty-front): unify Favorites and Workspace navigation menu item code (#18697)):packages/twenty-front/src/modules/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionContainer.tsx
import { WorkspaceSectionListEditModeFallback } from '@/object-metadata/components/WorkspaceSectionListEditModeFallback';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { type ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { getObjectPermissionsForObject } from '@/object-metadata/utils/getObjectPermissionsForObject';
import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { useNavigationSection } from '@/ui/navigation/navigation-drawer/hooks/useNavigationSection';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { viewsSelector } from '@/views/states/selectors/viewsSelector';

const LazyWorkspaceSectionListDndKit = lazy(() =>
  import(
<<<<<<<< HEAD:packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForWorkspaceItems.tsx
    '@/object-metadata/components/NavigationDrawerSectionForWorkspaceItemsListDndKit'
========
    '@/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionListDndKit'
>>>>>>>> 9f7c29bce8 (refactor(twenty-front): unify Favorites and Workspace navigation menu item code (#18697)):packages/twenty-front/src/modules/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionContainer.tsx
  ).then((m) => ({ default: m.WorkspaceSectionListDndKit })),
);

const StyledWorkspaceSectionContentGapOffset = styled.div`
  margin-top: calc(-1 * ${themeCssVariables.betweenSiblingsGap});
`;

type WorkspaceSectionContainerProps = {
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

export const WorkspaceSectionContainer = ({
  sectionTitle,
  items,
  rightIcon,
  selectedNavigationMenuItemId = null,
  onNavigationMenuItemClick,
  onActiveObjectMetadataItemClick,
<<<<<<<< HEAD:packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForWorkspaceItems.tsx
}: NavigationDrawerSectionForWorkspaceItemsProps) => {
  const isNavigationMenuInEditMode = useAtomStateValue(
    isNavigationMenuInEditModeState,
========
}: WorkspaceSectionContainerProps) => {
  const isLayoutCustomizationModeEnabled = useAtomStateValue(
    isLayoutCustomizationModeEnabledState,
>>>>>>>> 9f7c29bce8 (refactor(twenty-front): unify Favorites and Workspace navigation menu item code (#18697)):packages/twenty-front/src/modules/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionContainer.tsx
  );
  const { toggleNavigationSection, isNavigationSectionOpen } =
    useNavigationSection('Workspace');
  const views = useAtomStateValue(viewsSelector);

  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsState);
  const { addToNavigationFallbackDestination } = useContext(
    NavigationDropTargetContext,
  );

  const flatItems = items.filter((item) => !isDefined(item.folderId));
  const isAddToNavigationDropTargetVisible =
    addToNavigationFallbackDestination?.droppableId ===
    NavigationMenuItemDroppableIds.WORKSPACE_ORPHAN_NAVIGATION_MENU_ITEMS;
  const folderChildrenById = items.reduce<Map<string, NavigationMenuItem[]>>(
    (acc, item) => {
      const folderId = item.folderId;
      if (isDefined(folderId)) {
        const children = acc.get(folderId) ?? [];
        children.push(item);
        acc.set(folderId, children);
      }
      return acc;
    },
    new Map(),
  );

  const filteredItems = flatItems.filter((item) => {
    const itemType = item.type;
    if (
      itemType === NavigationMenuItemType.FOLDER ||
      itemType === NavigationMenuItemType.LINK ||
      itemType === NavigationMenuItemType.PAGE_LAYOUT
    ) {
      return true;
    }
    if (
      itemType === NavigationMenuItemType.OBJECT ||
      itemType === NavigationMenuItemType.VIEW ||
      itemType === NavigationMenuItemType.RECORD
    ) {
      const objectMetadataItem = getObjectMetadataForNavigationMenuItem(
        item,
        objectMetadataItems,
        views,
      );
      return (
        isDefined(objectMetadataItem) &&
        getObjectPermissionsForObject(
          objectPermissionsByObjectMetadataId,
          objectMetadataItem.id,
        ).canReadObjectRecords
      );
    }
    return false;
  });

  const getEditModeProps = (item: NavigationMenuItem): EditModeProps => {
    const itemId = item.id;
    return {
      isSelectedInEditMode: selectedNavigationMenuItemId === itemId,
      onEditModeClick: onNavigationMenuItemClick
        ? () => {
            const itemType = item.type;
            const objectMetadataItem =
              itemType === 'OBJECT' ||
              itemType === 'VIEW' ||
              itemType === 'RECORD'
                ? getObjectMetadataForNavigationMenuItem(
                    item,
                    objectMetadataItems,
                    views,
                  )
                : null;
            onNavigationMenuItemClick({
              item,
              objectMetadataItem: objectMetadataItem ?? undefined,
            });
          }
        : undefined,
    };
  };

  if (flatItems.length === 0 && !isAddToNavigationDropTargetVisible) {
    return null;
  }

  return (
<<<<<<<< HEAD:packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForWorkspaceItems.tsx
    <NavigationDrawerSection>
      <NavigationDrawerAnimatedCollapseWrapper>
        <NavigationDrawerSectionTitle
          label={sectionTitle}
          onClick={() => toggleNavigationSection()}
          rightIcon={rightIcon}
          alwaysShowRightIcon={isNavigationMenuInEditMode}
          isOpen={isNavigationSectionOpen}
        />
      </NavigationDrawerAnimatedCollapseWrapper>
      <StyledWorkspaceSectionContentGapOffset>
        <AnimatedExpandableContainer
          isExpanded={
            isNavigationSectionOpen || isAddToNavigationDropTargetVisible
          }
          dimension="height"
          mode="fit-content"
          containAnimation
          initial={false}
        >
          {isNavigationMenuInEditMode ? (
            <Suspense
              fallback={
                <WorkspaceSectionListEditModeFallback
                  filteredItems={filteredItems}
                  folderChildrenById={folderChildrenById}
                  onActiveObjectMetadataItemClick={
                    onActiveObjectMetadataItemClick
                  }
                />
              }
            >
              <LazyWorkspaceSectionListDndKit
                filteredItems={filteredItems}
                getEditModeProps={getEditModeProps}
                folderChildrenById={folderChildrenById}
                selectedNavigationMenuItemId={selectedNavigationMenuItemId}
                onNavigationMenuItemClick={onNavigationMenuItemClick}
                onActiveObjectMetadataItemClick={
                  onActiveObjectMetadataItemClick
                }
              />
            </Suspense>
          ) : (
            <NavigationDrawerSectionForWorkspaceItemsListReadOnly
========
    <NavigationMenuItemSection
      title={sectionTitle}
      isOpen={isNavigationSectionOpen}
      onToggle={() => toggleNavigationSection()}
      rightIcon={rightIcon}
      alwaysShowRightIcon={isLayoutCustomizationModeEnabled}
      forceExpanded={isAddToNavigationDropTargetVisible}
      contentWrapper={(children) => (
        <StyledWorkspaceSectionContentGapOffset>
          {children}
        </StyledWorkspaceSectionContentGapOffset>
      )}
    >
      {isLayoutCustomizationModeEnabled ? (
        <Suspense
          fallback={
            <WorkspaceSectionListEditModeFallback
>>>>>>>> 9f7c29bce8 (refactor(twenty-front): unify Favorites and Workspace navigation menu item code (#18697)):packages/twenty-front/src/modules/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionContainer.tsx
              filteredItems={filteredItems}
              folderChildrenById={folderChildrenById}
              onActiveObjectMetadataItemClick={onActiveObjectMetadataItemClick}
            />
          }
        >
          <LazyWorkspaceSectionListDndKit
            filteredItems={filteredItems}
            getEditModeProps={getEditModeProps}
            folderChildrenById={folderChildrenById}
            selectedNavigationMenuItemId={selectedNavigationMenuItemId}
            onNavigationMenuItemClick={onNavigationMenuItemClick}
            onActiveObjectMetadataItemClick={onActiveObjectMetadataItemClick}
          />
        </Suspense>
      ) : (
        <WorkspaceSectionListReadOnly
          filteredItems={filteredItems}
          folderChildrenById={folderChildrenById}
          onActiveObjectMetadataItemClick={onActiveObjectMetadataItemClick}
        />
      )}
    </NavigationMenuItemSection>
  );
};
