import { defineField, FieldType, RelationType } from 'twenty-sdk/define';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.partnerProfile.referralEvents,
  objectUniversalIdentifier: CORE_OBJECT_IDS.partnerProfile,
  type: FieldType.RELATION,
  name: 'agencyReferralEvents',
  label: 'Agency Referral Events',
  description: 'Signed referral events connected to this partner profile.',
  icon: 'IconWebhook',
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECT_IDS.agencyReferralEvent,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyReferralEvent.partnerProfile,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
