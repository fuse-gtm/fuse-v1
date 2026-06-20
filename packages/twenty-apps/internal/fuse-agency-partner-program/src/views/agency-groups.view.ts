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
  universalIdentifier: VIEW_IDS.agencyGroups,
  name: 'Agency Groups',
  objectUniversalIdentifier: OBJECT_IDS.agencyGroup,
  type: ViewType.TABLE,
  icon: 'IconUsersGroup',
  key: ViewKey.INDEX,
  position: 7,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[26],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyGroup.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[27],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyGroup.tier,
      position: 1,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[28],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyGroup.status,
      position: 2,
      isVisible: true,
      size: 140,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.agencyGroups,
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyGroup.name,
      direction: ViewSortDirection.ASC,
    },
  ],
});
