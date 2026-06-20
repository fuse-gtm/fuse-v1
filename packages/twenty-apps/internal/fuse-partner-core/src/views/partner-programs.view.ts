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
  universalIdentifier: VIEW_IDS.partnerPrograms,
  name: 'Partner Programs',
  objectUniversalIdentifier: OBJECT_IDS.partnerProgram,
  type: ViewType.TABLE,
  icon: 'IconRoute',
  key: ViewKey.INDEX,
  position: 0,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[8],
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerProgram.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[9],
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerProgram.mechanic,
      position: 1,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[10],
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerProgram.ecosystem,
      position: 2,
      isVisible: true,
      size: 180,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.partnerPrograms,
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerProgram.name,
      direction: ViewSortDirection.ASC,
    },
  ],
});
