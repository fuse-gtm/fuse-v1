import { defineField, FieldType, RelationType } from 'twenty-sdk/define';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.partnerProfile.agencyApplications,
  objectUniversalIdentifier: CORE_OBJECT_IDS.partnerProfile,
  type: FieldType.RELATION,
  name: 'agencyApplications',
  label: 'Agency Applications',
  description: 'Agency applications connected to this partner profile.',
  icon: 'IconClipboardText',
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECT_IDS.agencyApplication,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyApplication.partnerProfile,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
