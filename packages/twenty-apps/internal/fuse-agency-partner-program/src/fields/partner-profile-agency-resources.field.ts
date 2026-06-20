import { defineField, FieldType, RelationType } from 'twenty-sdk/define';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.partnerProfile.resources,
  objectUniversalIdentifier: CORE_OBJECT_IDS.partnerProfile,
  type: FieldType.RELATION,
  name: 'agencyResources',
  label: 'Agency Resources',
  description: 'Agency enablement resources connected to this partner profile.',
  icon: 'IconLibrary',
  relationTargetObjectMetadataUniversalIdentifier: OBJECT_IDS.agencyResource,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyResource.partnerProfile,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
