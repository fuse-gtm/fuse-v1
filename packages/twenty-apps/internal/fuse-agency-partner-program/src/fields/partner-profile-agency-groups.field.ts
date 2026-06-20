import { defineField, FieldType, RelationType } from 'twenty-sdk/define';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.partnerProfile.agencyGroups,
  objectUniversalIdentifier: CORE_OBJECT_IDS.partnerProfile,
  type: FieldType.RELATION,
  name: 'agencyGroups',
  label: 'Agency Groups',
  description: 'Agency groups connected to this partner profile.',
  icon: 'IconUsersGroup',
  relationTargetObjectMetadataUniversalIdentifier: OBJECT_IDS.agencyGroup,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyGroup.partnerProfile,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
