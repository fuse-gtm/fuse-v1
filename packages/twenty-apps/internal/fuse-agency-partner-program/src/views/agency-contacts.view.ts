import {
  defineView,
  ViewKey,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  CORE_FIELD_IDS,
  STANDARD_FIELD_IDS,
  STANDARD_OBJECT_IDS,
} from 'src/constants/core-identifiers';
import {
  VIEW_FIELD_IDS,
  VIEW_IDS,
  VIEW_SORT_IDS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW_IDS.agencyContacts,
  name: 'Agency Contacts',
  objectUniversalIdentifier: STANDARD_OBJECT_IDS.person,
  type: ViewType.TABLE,
  icon: 'IconUsers',
  key: ViewKey.INDEX,
  position: 3,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[11],
      fieldMetadataUniversalIdentifier: STANDARD_FIELD_IDS.person.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[12],
      fieldMetadataUniversalIdentifier: STANDARD_FIELD_IDS.person.emails,
      position: 1,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[13],
      fieldMetadataUniversalIdentifier: CORE_FIELD_IDS.person.partnerRole,
      position: 2,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[14],
      fieldMetadataUniversalIdentifier:
        CORE_FIELD_IDS.person.isPartnerContact,
      position: 3,
      isVisible: true,
      size: 160,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.agencyContacts,
      fieldMetadataUniversalIdentifier: STANDARD_FIELD_IDS.person.name,
      direction: ViewSortDirection.ASC,
    },
  ],
});
