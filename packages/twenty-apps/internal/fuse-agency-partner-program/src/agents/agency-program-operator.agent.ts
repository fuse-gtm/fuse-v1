import { defineAgent } from 'twenty-sdk/define';
import { AGENCY_PROGRAM_OPERATOR_AGENT_PROMPT } from 'src/operator/agency-program-operator-content';
import { AGENT_IDS } from 'src/constants/universal-identifiers';

export default defineAgent({
  universalIdentifier: AGENT_IDS.agencyProgramOperator,
  name: 'agency-program-operator',
  label: 'Agency Program Operator',
  icon: 'IconAffiliate',
  description:
    'AI operator prompt for agency program review, attribution, and taxonomy-safe guidance.',
  prompt: AGENCY_PROGRAM_OPERATOR_AGENT_PROMPT,
});
