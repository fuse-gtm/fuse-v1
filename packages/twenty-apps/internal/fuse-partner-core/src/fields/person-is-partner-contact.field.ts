import { defineField, FieldType, STANDARD_OBJECT } from 'twenty-sdk/define';
import { FIELD_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.person.isPartnerContact,
  objectUniversalIdentifier: STANDARD_OBJECT.person.universalIdentifier,
  type: FieldType.BOOLEAN,
  name: 'isPartnerContact',
  label: 'Is Partner Contact',
  description: 'Whether this person is part of a partner relationship.',
  icon: 'IconUserCheck',
  defaultValue: false,
});
