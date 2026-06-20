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
  universalIdentifier: VIEW_IDS.partnerProfiles,
  name: 'Partner Profiles',
  objectUniversalIdentifier: OBJECT_IDS.partnerProfile,
  type: ViewType.TABLE,
  icon: 'IconAffiliate',
  key: ViewKey.INDEX,
  position: 0,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[0],
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerProfile.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[1],
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerProfile.partnerType,
      position: 1,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[2],
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerProfile.status,
      position: 2,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[3],
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProfile.programMechanics,
      position: 3,
      isVisible: true,
      size: 220,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.partnerProfiles,
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerProfile.name,
      direction: ViewSortDirection.ASC,
    },
  ],
});
