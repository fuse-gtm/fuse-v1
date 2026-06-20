import {
  defineView,
  ViewFilterOperand,
  ViewKey,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  CORE_FIELD_IDS,
  CORE_OBJECT_IDS,
} from 'src/constants/core-identifiers';
import {
  VIEW_FIELD_IDS,
  VIEW_FILTER_IDS,
  VIEW_IDS,
  VIEW_SORT_IDS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW_IDS.activeAgencies,
  name: 'Active Agencies',
  objectUniversalIdentifier: CORE_OBJECT_IDS.partnerProfile,
  type: ViewType.TABLE,
  icon: 'IconAffiliate',
  key: ViewKey.INDEX,
  position: 1,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[4],
      fieldMetadataUniversalIdentifier: CORE_FIELD_IDS.partnerProfile.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[5],
      fieldMetadataUniversalIdentifier:
        CORE_FIELD_IDS.partnerProfile.partnerType,
      position: 1,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[6],
      fieldMetadataUniversalIdentifier: CORE_FIELD_IDS.partnerProfile.status,
      position: 2,
      isVisible: true,
      size: 140,
    },
  ],
  filters: [
    {
      universalIdentifier: VIEW_FILTER_IDS.activeAgenciesPartnerType,
      fieldMetadataUniversalIdentifier:
        CORE_FIELD_IDS.partnerProfile.partnerType,
      operand: ViewFilterOperand.IS,
      value: 'agency',
    },
    {
      universalIdentifier: VIEW_FILTER_IDS.activeAgenciesStatus,
      fieldMetadataUniversalIdentifier: CORE_FIELD_IDS.partnerProfile.status,
      operand: ViewFilterOperand.IS,
      value: 'active',
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.activeAgencies,
      fieldMetadataUniversalIdentifier: CORE_FIELD_IDS.partnerProfile.name,
      direction: ViewSortDirection.ASC,
    },
  ],
});
