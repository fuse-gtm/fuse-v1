import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { NAVIGATION_IDS } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAVIGATION_IDS.folder,
  name: 'Agency Partners',
  icon: 'IconAffiliate',
  color: 'blue',
  position: 21,
  type: NavigationMenuItemType.FOLDER,
});
