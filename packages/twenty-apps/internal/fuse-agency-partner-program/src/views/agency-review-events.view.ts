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
  universalIdentifier: VIEW_IDS.reviewEvents,
  name: 'Review Events',
  objectUniversalIdentifier: OBJECT_IDS.agencyReviewEvent,
  type: ViewType.TABLE,
  icon: 'IconTimelineEvent',
  key: ViewKey.INDEX,
  position: 8,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[29],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReviewEvent.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[30],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReviewEvent.action,
      position: 1,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[31],
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyReviewEvent.occurredAt,
      position: 2,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[32],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReviewEvent.reason,
      position: 3,
      isVisible: true,
      size: 280,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.reviewEvents,
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyReviewEvent.occurredAt,
      direction: ViewSortDirection.DESC,
    },
  ],
});
