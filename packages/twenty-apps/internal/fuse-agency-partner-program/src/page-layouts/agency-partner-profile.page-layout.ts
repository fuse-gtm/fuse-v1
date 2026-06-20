import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import {
  FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  PAGE_LAYOUT_IDS,
} from 'src/constants/universal-identifiers';
import { definePageLayout, PageLayoutTabLayoutMode } from 'twenty-sdk/define';

export default definePageLayout({
  universalIdentifier: PAGE_LAYOUT_IDS.partnerProfile,
  name: 'Agency Partner Profile',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier: CORE_OBJECT_IDS.partnerProfile,
  tabs: [
    {
      universalIdentifier: PAGE_LAYOUT_IDS.overviewTab,
      title: 'Agency Overview',
      position: 60,
      icon: 'IconAffiliate',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: PAGE_LAYOUT_IDS.overviewWidget,
          title: 'Agency Overview',
          type: 'FRONT_COMPONENT',
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier:
              FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
          },
        },
      ],
    },
  ],
});
