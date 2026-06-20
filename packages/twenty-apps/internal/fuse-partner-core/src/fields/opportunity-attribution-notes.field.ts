import { defineField, FieldType, STANDARD_OBJECT } from 'twenty-sdk/define';
import { FIELD_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.opportunity.attributionNotes,
  objectUniversalIdentifier: STANDARD_OBJECT.opportunity.universalIdentifier,
  type: FieldType.TEXT,
  name: 'partnerAttributionNotes',
  label: 'Partner Attribution Notes',
  description: 'Operator notes for partner attribution decisions.',
  icon: 'IconNotes',
});
