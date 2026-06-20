import { defineField, FieldType, STANDARD_OBJECT } from 'twenty-sdk/define';
import { PARTNER_STATUS_OPTIONS } from 'src/constants/options';
import { FIELD_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.company.partnerStatus,
  objectUniversalIdentifier: STANDARD_OBJECT.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'partnerStatus',
  label: 'Partner Status',
  description: 'Current operating status for this company as a partner.',
  icon: 'IconProgressCheck',
  options: PARTNER_STATUS_OPTIONS,
});
