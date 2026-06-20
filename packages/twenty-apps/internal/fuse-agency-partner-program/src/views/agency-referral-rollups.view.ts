import {
  defineView,
  ViewKey,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  FIELD_IDS,
  OBJECT_IDS,
  VIEW_FIELD_IDS,
  VIEW_IDS,
  VIEW_SORT_IDS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW_IDS.referralRollups,
  name: 'Referral Rollups',
  objectUniversalIdentifier: OBJECT_IDS.agencyReferralRollup,
  type: ViewType.TABLE,
  icon: 'IconChartBar',
  key: ViewKey.INDEX,
  position: 10,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[37],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReferralRollup.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[38],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReferralRollup.scopeType,
      position: 1,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[39],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReferralRollup.leadCount,
      position: 2,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[40],
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyReferralRollup.revenueCents,
      position: 3,
      isVisible: true,
      size: 160,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.referralRollups,
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyReferralRollup.lastEventAt,
      direction: ViewSortDirection.DESC,
    },
  ],
});
