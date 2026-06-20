import { t } from '@lingui/core/macro';

export const getCustomApplicationDescription =
  (): string => t`Host your workspace's customizations and overrides.

#### What it includes
Every extension you create on top of the standard app is grouped under Custom. It keeps your schema changes, interface changes, and workspace-specific logic in one place.

- Custom objects and fields for your own data model
- Views, navigation items, and record layouts that shape how your team works
- Logic functions, front components, and agents that automate or extend the workspace

#### Why it exists
Use this app for workspace-specific customization that should stay local to this workspace.

If you are shaping one workspace for one business, keep it here. If you are building a reusable business app with its own data model, UI, and automation that should be versioned, shared, or installed across workspaces, create a dedicated app instead.

#### Build your own app

Start from a Fuse app package, keep app identifiers stable, and publish it as a private app for Fuse workspaces.

\`\`\`bash
yarn twenty dev
\`\`\`

See the [Fuse developer documentation](https://docs.fusegtm.com/docs/developers/extend) for the full walkthrough and the \`defineApplication\` APIs.`;
