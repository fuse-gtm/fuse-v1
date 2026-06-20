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
  universalIdentifier: VIEW_IDS.resources,
  name: 'Resources',
  objectUniversalIdentifier: OBJECT_IDS.agencyResource,
  type: ViewType.TABLE,
  icon: 'IconLibrary',
  key: ViewKey.INDEX,
  position: 4,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[15],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyResource.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[16],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyResource.resourceType,
      position: 1,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[17],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyResource.status,
      position: 2,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[18],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyResource.url,
      position: 3,
      isVisible: true,
      size: 280,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.resources,
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyResource.name,
      direction: ViewSortDirection.ASC,
    },
  ],
});
