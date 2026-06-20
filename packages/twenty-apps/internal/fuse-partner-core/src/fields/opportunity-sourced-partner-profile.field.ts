import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT,
} from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.opportunity.sourcedPartnerProfile,
  objectUniversalIdentifier: STANDARD_OBJECT.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'sourcedPartnerProfile',
  label: 'Sourced Partner Profile',
  description:
    'Partner profile credited with sourcing or influencing this opportunity.',
  icon: 'IconAffiliate',
  relationTargetObjectMetadataUniversalIdentifier: OBJECT_IDS.partnerProfile,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.partnerProfile.sourcedOpportunities,
  isNullable: true,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'sourcedPartnerProfileId',
  },
});
