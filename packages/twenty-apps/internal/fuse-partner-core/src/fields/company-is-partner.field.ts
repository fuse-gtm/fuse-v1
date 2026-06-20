import { defineField, FieldType, STANDARD_OBJECT } from 'twenty-sdk/define';
import { FIELD_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.company.isPartner,
  objectUniversalIdentifier: STANDARD_OBJECT.company.universalIdentifier,
  type: FieldType.BOOLEAN,
  name: 'isPartner',
  label: 'Is Partner',
  description: 'Whether this company participates in a partner motion.',
  icon: 'IconAffiliate',
  defaultValue: false,
});
