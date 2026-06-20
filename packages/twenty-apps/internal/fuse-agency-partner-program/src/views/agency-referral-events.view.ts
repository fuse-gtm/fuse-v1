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
  universalIdentifier: VIEW_IDS.referralEvents,
  name: 'Referral Events',
  objectUniversalIdentifier: OBJECT_IDS.agencyReferralEvent,
  type: ViewType.TABLE,
  icon: 'IconWebhook',
  key: ViewKey.INDEX,
  position: 9,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[33],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReferralEvent.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[34],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReferralEvent.eventType,
      position: 1,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[35],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReferralEvent.status,
      position: 2,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[36],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReferralEvent.occurredAt,
      position: 3,
      isVisible: true,
      size: 180,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.referralEvents,
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReferralEvent.occurredAt,
      direction: ViewSortDirection.DESC,
    },
  ],
});
