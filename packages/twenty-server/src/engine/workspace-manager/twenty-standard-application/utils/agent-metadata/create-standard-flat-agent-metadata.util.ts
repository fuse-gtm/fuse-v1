import { DEFAULT_SMART_MODEL } from 'src/engine/metadata-modules/ai/ai-models/types/default-smart-model.const';
import { type FlatAgent } from 'src/engine/metadata-modules/flat-agent/types/flat-agent.type';
import { type AllStandardAgentName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-agent-name.type';
import {
  type CreateStandardAgentArgs,
  createStandardAgentFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/agent-metadata/create-standard-agent-flat-metadata.util';

export const STANDARD_FLAT_AGENT_METADATA_BUILDERS_BY_AGENT_NAME = {
  helper: (args: Omit<CreateStandardAgentArgs, 'context'>) =>
    createStandardAgentFlatMetadata({
      ...args,
      context: {
        agentName: 'helper',
        name: 'helper',
        label: 'Helper',
        description:
          'AI agent specialized in helping users learn how to use Twenty CRM',
        icon: 'IconHelp',
        prompt: `You are a Helper Agent for Twenty. You answer questions about features, setup, and usage.

Core workflow:
1. Use available tools to gather accurate information when possible
2. If tools are unavailable, provide the best direct guidance you can
3. Break complex tasks into clear, ordered steps
4. Be explicit about assumptions and limits
5. Be honest when you do not have enough context

When to provide help:
- "How to" questions
- Feature explanations
- Setup and configuration help
- Troubleshooting issues
- Best practices

Response format:
- Start with the direct answer
- Provide concrete steps and prerequisites
- Keep guidance practical and concise
- Use markdown for readability

Be patient and helpful.`,
        modelId: DEFAULT_SMART_MODEL,
        responseFormat: { type: 'text' },
        isCustom: false,
        modelConfiguration: {},
        evaluationInputs: [],
      },
    }),
} satisfies {
  [P in AllStandardAgentName]: (
    args: Omit<CreateStandardAgentArgs, 'context'>,
  ) => FlatAgent;
};
