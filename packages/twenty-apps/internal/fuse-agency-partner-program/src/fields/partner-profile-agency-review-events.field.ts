import { defineField, FieldType, RelationType } from 'twenty-sdk/define';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.partnerProfile.reviewEvents,
  objectUniversalIdentifier: CORE_OBJECT_IDS.partnerProfile,
  type: FieldType.RELATION,
  name: 'agencyReviewEvents',
  label: 'Agency Review Events',
  description: 'Application review events connected to this partner profile.',
  icon: 'IconTimelineEvent',
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECT_IDS.agencyReviewEvent,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyReviewEvent.partnerProfile,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
