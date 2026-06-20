import { defineField, FieldType, STANDARD_OBJECT } from 'twenty-sdk/define';
import { COMMERCIAL_MODEL_OPTIONS } from 'src/constants/options';
import { FIELD_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.company.commercialModels,
  objectUniversalIdentifier: STANDARD_OBJECT.company.universalIdentifier,
  type: FieldType.MULTI_SELECT,
  name: 'partnerCommercialModels',
  label: 'Commercial Models',
  description:
    'How value flows between this company and Fuse, independent of program mechanic.',
  icon: 'IconCoins',
  options: COMMERCIAL_MODEL_OPTIONS,
});
