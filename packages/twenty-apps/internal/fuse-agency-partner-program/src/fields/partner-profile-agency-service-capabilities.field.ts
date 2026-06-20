import { defineField, FieldType, RelationType } from 'twenty-sdk/define';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.partnerProfile.serviceCapabilities,
  objectUniversalIdentifier: CORE_OBJECT_IDS.partnerProfile,
  type: FieldType.RELATION,
  name: 'agencyServiceCapabilities',
  label: 'Agency Service Capabilities',
  description:
    'Agency service capabilities connected to this partner profile.',
  icon: 'IconBriefcase',
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECT_IDS.agencyServiceCapability,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyServiceCapability.partnerProfile,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
