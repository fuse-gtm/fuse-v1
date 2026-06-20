import { t } from '@lingui/core/macro';

export const getStandardApplicationDescription =
  (): string => t`The base data model every Fuse workspace runs on.

#### What "foundation" means

Every Fuse workspace starts with this set of objects. They define the shape of your partnership operations, including relationships, activity, and reporting. Everything else, including private apps, AI agents, and custom objects, plugs into them.

#### Included objects
- **People & Companies**: contact and account records
- **Opportunities**: your sales pipeline
- **Notes & Tasks**: activity and follow-ups
- **Workflows & Dashboards**: automation and reporting

Remove this app and the rest of Fuse has nothing to hang off.

#### Build your own app

Extend Fuse with your own objects, fields, logic functions, or AI skills. Start from a Fuse app package and keep app identifiers stable:

\`\`\`bash
yarn twenty dev
\`\`\`

See the [Fuse developer documentation](https://docs.fusegtm.com/docs/developers/extend) for the full walkthrough and the \`defineApplication\` APIs.`;
