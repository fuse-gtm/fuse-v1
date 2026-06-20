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
  universalIdentifier: VIEW_IDS.attribution,
  name: 'Attribution',
  objectUniversalIdentifier: OBJECT_IDS.agencyAttribution,
  type: ViewType.TABLE,
  icon: 'IconTargetArrow',
  key: ViewKey.INDEX,
  position: 5,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[19],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyAttribution.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[20],
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyAttribution.attributionType,
      position: 1,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[21],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyAttribution.status,
      position: 2,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[22],
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyAttribution.amountCents,
      position: 3,
      isVisible: true,
      size: 150,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.attribution,
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyAttribution.name,
      direction: ViewSortDirection.ASC,
    },
  ],
});
