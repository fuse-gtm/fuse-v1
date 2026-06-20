import { defineField, FieldType, RelationType } from 'twenty-sdk/define';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.partnerProfile.agencyTasks,
  objectUniversalIdentifier: CORE_OBJECT_IDS.partnerProfile,
  type: FieldType.RELATION,
  name: 'agencyTasks',
  label: 'Agency Tasks',
  description: 'Agency operator tasks connected to this partner profile.',
  icon: 'IconCheckbox',
  relationTargetObjectMetadataUniversalIdentifier: OBJECT_IDS.agencyTask,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyTask.partnerProfile,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
