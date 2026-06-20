import { defineField, FieldType, STANDARD_OBJECT } from 'twenty-sdk/define';
import { ATTRIBUTION_STATUS_OPTIONS } from 'src/constants/options';
import { FIELD_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.opportunity.attributionStatus,
  objectUniversalIdentifier: STANDARD_OBJECT.opportunity.universalIdentifier,
  type: FieldType.SELECT,
  name: 'partnerAttributionStatus',
  label: 'Partner Attribution Status',
  description: 'Approval/payment state for partner attribution on this deal.',
  icon: 'IconReceipt',
  options: ATTRIBUTION_STATUS_OPTIONS,
});
