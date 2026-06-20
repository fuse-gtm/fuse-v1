import { defineField, FieldType, STANDARD_OBJECT } from 'twenty-sdk/define';
import { PROGRAM_MECHANIC_OPTIONS } from 'src/constants/options';
import { FIELD_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.company.programMechanics,
  objectUniversalIdentifier: STANDARD_OBJECT.company.universalIdentifier,
  type: FieldType.MULTI_SELECT,
  name: 'partnerProgramMechanics',
  label: 'Program Mechanics',
  description:
    'Axis 2 mechanics this company can participate in, separate from partner type.',
  icon: 'IconRoute',
  options: PROGRAM_MECHANIC_OPTIONS,
});
