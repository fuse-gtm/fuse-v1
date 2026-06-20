import { defineSkill } from 'twenty-sdk/define';
import { AGENCY_PROGRAM_OPERATOR_SKILL_CONTENT } from 'src/operator/agency-program-operator-content';
import { SKILL_IDS } from 'src/constants/universal-identifiers';

export default defineSkill({
  universalIdentifier: SKILL_IDS.agencyProgramOperator,
  name: 'agency-program-operator',
  label: 'Agency Program Operator',
  icon: 'IconAffiliate',
  description:
    'Fuse agency partner model rules and route-backed operator workflow guidance.',
  content: AGENCY_PROGRAM_OPERATOR_SKILL_CONTENT,
});
