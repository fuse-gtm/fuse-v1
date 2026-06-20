import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type FileCheck = {
  path: string;
  required: string[];
  disallowed?: string[];
};

const checks: FileCheck[] = [
  {
    path: 'packages/twenty-front/index.html',
    required: [
      '<title>Fuse</title>',
      'Fuse — the partnerships operating system',
      '/images/icons/fuse-favicon.ico',
      'href="/manifest.json"',
    ],
  },
  {
    path: 'packages/twenty-front/public/manifest.json',
    required: [
      '"short_name": "Fuse"',
      '"name": "Fuse"',
      '"description": "Fuse — the partnerships operating system"',
    ],
  },
  {
    path: 'packages/twenty-front/src/pages/auth/SignInUp.tsx',
    required: ['Welcome to Fuse'],
  },
  {
    path: 'packages/twenty-front/src/modules/auth/sign-in-up/components/FooterNote.tsx',
    required: [
      'By using Fuse',
      'https://fusegtm.com/legal/terms',
      'https://fusegtm.com/legal/privacy',
    ],
  },
  {
    path: 'packages/twenty-front/src/pages/onboarding/SyncEmails.tsx',
    required: ['with Fuse'],
  },
  {
    path: 'packages/twenty-front/src/pages/not-found/NotFound.tsx',
    required: ['Page Not Found | Fuse'],
  },
  {
    path: 'packages/twenty-front/src/pages/settings/applications/utils/getCustomApplicationDescription.ts',
    required: [
      'Fuse app package',
      'private app for Fuse workspaces',
      'https://docs.fusegtm.com/docs/developers/extend',
    ],
    disallowed: ['twenty.com', 'create-twenty-app', 'my-twenty-app'],
  },
  {
    path: 'packages/twenty-front/src/pages/settings/applications/utils/getStandardApplicationDescription.ts',
    required: [
      'Fuse workspace',
      'Extend Fuse',
      'https://docs.fusegtm.com/docs/developers/extend',
    ],
    disallowed: [
      'Twenty workspace',
      'the rest of Twenty',
      'Extend Twenty',
      'twenty.com',
      'create-twenty-app',
      'my-twenty-app',
    ],
  },
  {
    path: 'packages/twenty-emails/src/components/BaseHead.tsx',
    required: ['Fuse email'],
  },
  {
    path: 'packages/twenty-emails/src/components/Footer.tsx',
    required: [
      'https://fusegtm.com/',
      'https://github.com/fuse-gtm/fuse-v1',
      'https://docs.fusegtm.com/docs/user-guide/introduction',
      'https://docs.fusegtm.com/docs/developers/extend',
      'Fuse GTM',
      'Partnerships operating system',
    ],
    disallowed: ['twenty.com', 'twentyhq', 'Twenty.com', "Twenty's"],
  },
  {
    path: 'packages/twenty-emails/src/components/WhatIsTwenty.tsx',
    required: ['What is Fuse?', 'partnerships operating system'],
    disallowed: ['What is Twenty?', "It's a CRM"],
  },
  {
    path: 'packages/twenty-emails/src/emails/send-invite-link.email.tsx',
    required: ['Join your team on Fuse'],
    disallowed: ['Join your team on Twenty'],
  },
  {
    path: 'packages/twenty-emails/src/constants/DefaultWorkspaceLogo.ts',
    required: ['app.fusegtm.com', 'Square150x150Logo.scale-100.png'],
    disallowed: ['twentyhq.github.io', 'twenty-logo.png'],
  },
];

const failures: string[] = [];

for (const check of checks) {
  const absolutePath = resolve(process.cwd(), check.path);

  if (!existsSync(absolutePath)) {
    failures.push(`${check.path}: file does not exist`);
    continue;
  }

  const contents = readFileSync(absolutePath, 'utf8');

  for (const expected of check.required) {
    if (!contents.includes(expected)) {
      failures.push(`${check.path}: missing required text "${expected}"`);
    }
  }

  for (const forbidden of check.disallowed ?? []) {
    if (contents.includes(forbidden)) {
      failures.push(`${check.path}: contains disallowed text "${forbidden}"`);
    }
  }
}

if (failures.length > 0) {
  console.error('Fuse shell branding audit failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log(`Fuse shell branding audit passed (${checks.length} files).`);
}
