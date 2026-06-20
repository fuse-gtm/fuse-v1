import { defineField, FieldType, RelationType } from 'twenty-sdk/define';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.partnerProfile.attributions,
  objectUniversalIdentifier: CORE_OBJECT_IDS.partnerProfile,
  type: FieldType.RELATION,
  name: 'agencyAttributions',
  label: 'Agency Attributions',
  description: 'Agency attribution records connected to this partner profile.',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECT_IDS.agencyAttribution,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyAttribution.partnerProfile,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
