import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { NAVIGATION_IDS, VIEW_IDS } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAVIGATION_IDS.agencyGroups,
  name: 'Agency Groups',
  icon: 'IconUsersGroup',
  position: 7,
  type: NavigationMenuItemType.VIEW,
  folderUniversalIdentifier: NAVIGATION_IDS.folder,
  viewUniversalIdentifier: VIEW_IDS.agencyGroups,
});
