import { type ReactNode } from 'react';
import { NavigationMenuItemType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

import { NavigationMenuItemIcon } from '@/navigation-menu-item/components/NavigationMenuItemIcon';
import { type NavigationMenuItemClickParams } from '@/navigation-menu-item/hooks/useWorkspaceSectionItems';
import { isNavigationMenuInEditModeState } from '@/navigation-menu-item/states/isNavigationMenuInEditModeState';
import { getNavigationMenuItemComputedLink } from '@/navigation-menu-item/utils/getNavigationMenuItemComputedLink';
import { getNavigationMenuItemLabel } from '@/navigation-menu-item/utils/getNavigationMenuItemLabel';
import { getNavigationMenuItemObjectNameSingular } from '@/navigation-menu-item/utils/getNavigationMenuItemObjectNameSingular';
import { getNavigationMenuItemSecondaryLabel } from '@/navigation-menu-item/utils/getNavigationMenuItemSecondaryLabel';
import { getObjectMetadataForNavigationMenuItem } from '@/navigation-menu-item/utils/getObjectMetadataForNavigationMenuItem';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { NavigationDrawerSubItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSubItem';
import { getNavigationSubItemLeftAdornment } from '@/ui/navigation/navigation-drawer/utils/getNavigationSubItemLeftAdornment';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { viewsSelector } from '@/views/states/selectors/viewsSelector';
import { ViewKey } from '@/views/types/ViewKey';

type NavigationMenuItemFolderSubItemProps = {
  navigationMenuItem: NavigationMenuItem;
  index: number;
  arrayLength: number;
  selectedNavigationMenuItemIndex: number;
  isDragging: boolean;
  rightOptions?: ReactNode;
  onClick?: () => void;
  onNavigationMenuItemClick?: (params: {
    item: NavigationMenuItem;
    objectMetadataItem?: ObjectMetadataItem;
  }) => void;
  selectedNavigationMenuItemId?: string | null;
};

export const NavigationMenuItemFolderSubItem = ({
  navigationMenuItem,
  index,
  arrayLength,
  selectedNavigationMenuItemIndex,
  isDragging,
  rightOptions,
  onClick,
  onNavigationMenuItemClick,
  selectedNavigationMenuItemId,
  isContextDragging,
}: WorkspaceNavigationMenuItemFolderSubItemProps) => {
  const isNavigationMenuInEditMode = useAtomStateValue(
    isNavigationMenuInEditModeState,
  );
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsState);
  const views = useAtomStateValue(viewsSelector);

  const objectMetadataItem =
    navigationMenuItem.type === NavigationMenuItemType.OBJECT ||
    navigationMenuItem.type === NavigationMenuItemType.VIEW ||
    navigationMenuItem.type === NavigationMenuItemType.RECORD
      ? getObjectMetadataForNavigationMenuItem(
          navigationMenuItem,
          objectMetadataItems,
          views,
        )
      : null;

  const isEditableInEditMode =
    isNavigationMenuInEditMode &&
    isDefined(onNavigationMenuItemClick) &&
    (navigationMenuItem.type === NavigationMenuItemType.LINK ||
      isDefined(objectMetadataItem));

  const handleEditModeClick =
    isEditableInEditMode && isDefined(onNavigationMenuItemClick)
      ? () =>
          onNavigationMenuItemClick({
            item: navigationMenuItem,
            objectMetadataItem: objectMetadataItem ?? undefined,
          })
      : undefined;

  const label = getNavigationMenuItemLabel(
    navigationMenuItem,
    objectMetadataItems,
    views,
  );
  const computedLink = getNavigationMenuItemComputedLink(
    navigationMenuItem,
    objectMetadataItems,
    views,
  );
  const objectNameSingular = getNavigationMenuItemObjectNameSingular(
    navigationMenuItem,
    objectMetadataItems,
    views,
  );

  const view = isDefined(navigationMenuItem.viewId)
    ? views.find((viewItem) => viewItem.id === navigationMenuItem.viewId)
    : undefined;
  const isIndexView = view?.key === ViewKey.INDEX;

  // (duplicate `const objectMetadataItem` removed — declared once at top of
  // function body. This was a conflict-marker cherry-pick leftover.)

  const isEditable =
    isDefined(onNavigationMenuItemClick) &&
    (navigationMenuItem.type === NavigationMenuItemType.LINK ||
      isDefined(objectMetadataItem));

  const handleClick =
    onClick ??
    (isEditable
      ? () =>
          onNavigationMenuItemClick({
            item: navigationMenuItem,
            objectMetadataItem: objectMetadataItem ?? undefined,
          })
      : undefined);

  return (
    <NavigationDrawerSubItem
      secondaryLabel={
        isIndexView
          ? undefined
          : getNavigationMenuItemSecondaryLabel({
              objectMetadataItems,
              navigationMenuItemObjectNameSingular: objectNameSingular ?? '',
            })
      }
      label={label}
      Icon={() => (
        <NavigationMenuItemIcon navigationMenuItem={navigationMenuItem} />
      )}
      iconColor={getEffectiveNavigationMenuItemColor(navigationMenuItem)}
      to={isDragging || handleClick ? undefined : computedLink}
      onClick={handleClick}
      active={index === selectedNavigationMenuItemIndex}
      isSelectedInEditMode={
        selectedNavigationMenuItemId === navigationMenuItem.id
      }
      subItemState={getNavigationSubItemLeftAdornment({
        index,
        arrayLength,
        selectedIndex: selectedNavigationMenuItemIndex,
      })}
      rightOptions={rightOptions}
      isDragging={isDragging}
      triggerEvent="CLICK"
    />
  );
};
