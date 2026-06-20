import { defineField, FieldType, STANDARD_OBJECT } from 'twenty-sdk/define';
import { OPPORTUNITY_SOURCE_OPTIONS } from 'src/constants/options';
import { FIELD_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.opportunity.partnerSource,
  objectUniversalIdentifier: STANDARD_OBJECT.opportunity.universalIdentifier,
  type: FieldType.SELECT,
  name: 'partnerSource',
  label: 'Partner Source',
  description: 'How this opportunity was sourced or influenced by a partner.',
  icon: 'IconSourceCode',
  options: OPPORTUNITY_SOURCE_OPTIONS,
});
