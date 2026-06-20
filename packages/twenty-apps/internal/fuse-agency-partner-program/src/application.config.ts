import { defineApplication } from 'twenty-sdk/define';
import {
  APPLICATION_VARIABLE_IDS,
  APPLICATION_UNIVERSAL_IDENTIFIER,
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Fuse Agency Partner Program',
  description:
    'Agency-specific partner program schema, operator views, and overview widget built on Fuse Partner Core.',
  defaultRoleUniversalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  applicationVariables: {
    AGENCY_EVENT_SIGNING_SECRET: {
      universalIdentifier:
        APPLICATION_VARIABLE_IDS.agencyEventSigningSecret,
      description:
        'Secret used to validate signed agency referral lead and sale events.',
      isSecret: true,
    },
  },
});
