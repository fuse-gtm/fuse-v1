import { defineField, FieldType, STANDARD_OBJECT } from 'twenty-sdk/define';
import { PERSON_ROLE_OPTIONS } from 'src/constants/options';
import { FIELD_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.person.partnerRole,
  objectUniversalIdentifier: STANDARD_OBJECT.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'partnerRole',
  label: 'Partner Role',
  description: 'The role this person plays in the partner relationship.',
  icon: 'IconUserStar',
  options: PERSON_ROLE_OPTIONS,
});
