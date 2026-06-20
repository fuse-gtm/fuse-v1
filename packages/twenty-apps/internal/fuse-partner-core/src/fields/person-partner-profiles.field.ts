import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT,
} from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.person.partnerProfiles,
  objectUniversalIdentifier: STANDARD_OBJECT.person.universalIdentifier,
  type: FieldType.RELATION,
  name: 'partnerProfiles',
  label: 'Partner Profiles',
  description: 'Partner profiles where this person is the primary contact.',
  icon: 'IconAffiliate',
  relationTargetObjectMetadataUniversalIdentifier: OBJECT_IDS.partnerProfile,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.partnerProfile.primaryContact,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
