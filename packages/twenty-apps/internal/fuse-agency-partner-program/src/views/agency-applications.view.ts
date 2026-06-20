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
  universalIdentifier: VIEW_IDS.applications,
  name: 'Applications',
  objectUniversalIdentifier: OBJECT_IDS.agencyApplication,
  type: ViewType.TABLE,
  icon: 'IconClipboardText',
  key: ViewKey.INDEX,
  position: 0,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[0],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyApplication.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[1],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyApplication.status,
      position: 1,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[2],
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyApplication.serviceBuckets,
      position: 2,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[3],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyApplication.submittedAt,
      position: 3,
      isVisible: true,
      size: 180,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.applications,
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyApplication.submittedAt,
      direction: ViewSortDirection.DESC,
    },
  ],
});
