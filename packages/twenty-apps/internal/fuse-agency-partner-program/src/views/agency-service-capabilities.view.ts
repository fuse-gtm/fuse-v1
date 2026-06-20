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
  universalIdentifier: VIEW_IDS.serviceCapabilities,
  name: 'Service Capabilities',
  objectUniversalIdentifier: OBJECT_IDS.agencyServiceCapability,
  type: ViewType.TABLE,
  icon: 'IconBriefcase',
  key: ViewKey.INDEX,
  position: 2,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[7],
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyServiceCapability.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[8],
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyServiceCapability.serviceBucket,
      position: 1,
      isVisible: true,
      size: 190,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[9],
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyServiceCapability.platformFocus,
      position: 2,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[10],
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyServiceCapability.capacityBand,
      position: 3,
      isVisible: true,
      size: 160,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.serviceCapabilities,
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyServiceCapability.name,
      direction: ViewSortDirection.ASC,
    },
  ],
});
