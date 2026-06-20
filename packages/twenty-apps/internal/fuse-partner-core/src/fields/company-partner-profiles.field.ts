import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT,
} from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.company.partnerProfiles,
  objectUniversalIdentifier: STANDARD_OBJECT.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'partnerProfiles',
  label: 'Partner Profiles',
  description: 'Fuse partner profiles attached to this company.',
  icon: 'IconAffiliate',
  relationTargetObjectMetadataUniversalIdentifier: OBJECT_IDS.partnerProfile,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.partnerProfile.company,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
