import { defineField, FieldType, RelationType } from 'twenty-sdk/define';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.partnerProfile.referralRollups,
  objectUniversalIdentifier: CORE_OBJECT_IDS.partnerProfile,
  type: FieldType.RELATION,
  name: 'agencyReferralRollups',
  label: 'Agency Referral Rollups',
  description: 'Referral rollups connected to this partner profile.',
  icon: 'IconChartBar',
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECT_IDS.agencyReferralRollup,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyReferralRollup.partnerProfile,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
