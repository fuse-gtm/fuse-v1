import { defineField, FieldType, STANDARD_OBJECT } from 'twenty-sdk/define';
import { PARTNER_TYPE_OPTIONS } from 'src/constants/options';
import { FIELD_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.company.partnerType,
  objectUniversalIdentifier: STANDARD_OBJECT.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'partnerType',
  label: 'Partner Type',
  description:
    'Axis 1 classification: what kind of partner organization this company is.',
  icon: 'IconCategory',
  options: PARTNER_TYPE_OPTIONS,
});
