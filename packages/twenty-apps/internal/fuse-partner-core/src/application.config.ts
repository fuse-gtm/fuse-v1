import { defineApplication } from 'twenty-sdk/define';
import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Fuse Partner Core',
  description:
    'Shared Fuse partner taxonomy, standard object extensions, and partner operating primitives.',
  icon: 'IconAffiliate',
  defaultRoleUniversalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
});
