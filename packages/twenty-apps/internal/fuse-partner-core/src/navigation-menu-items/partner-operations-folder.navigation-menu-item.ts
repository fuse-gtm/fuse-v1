import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';
import { NAVIGATION_IDS } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAVIGATION_IDS.folder,
  name: 'Partners',
  icon: 'IconAffiliate',
  color: 'blue',
  position: 20,
  type: NavigationMenuItemType.FOLDER,
});
