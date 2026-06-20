import * as fs from 'fs-extra';
import { join } from 'path';

const SEED_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDIwMjAyMC1lNmI1LTQ2ODAtOGEzMi1iODIwOTczNzE1NmIiLCJ1c2VySWQiOiIyMDIwMjAyMC1lNmI1LTQ2ODAtOGEzMi1iODIwOTczNzE1NmIiLCJ3b3Jrc3BhY2VJZCI6IjIwMjAyMDIwLTFjMjUtNGQwMi1iZjI1LTZhZWNjZjdlYTQxOSIsIndvcmtzcGFjZU1lbWJlcklkIjoiMjAyMDIwMjAtNDYzZi00MzViLTgyOGMtMTA3ZTAwN2EyNzExIiwidXNlcldvcmtzcGFjZUlkIjoiMjAyMDIwMjAtMWU3Yy00M2Q5LWE1ZGItNjg1YjUwNjlkODE2IiwidHlwZSI6IkFDQ0VTUyIsImF1dGhQcm92aWRlciI6InBhc3N3b3JkIiwiaWF0IjoxNzUxMjgxNzA0LCJleHAiOjIwNjY4NTc3MDR9.HMGqCsVlOAPVUBhKSGlD1X86VoHKt4LIUtET3CGIdik';

export const scaffoldIntegrationTest = async ({
  appDirectory,
  sourceFolderPath,
}: {
  appDirectory: string;
  sourceFolderPath: string;
}) => {
  await createIntegrationTest({
    appDirectory: sourceFolderPath,
    fileFolder: '__tests__',
    fileName: 'app-install.integration-test.ts',
  });

  await createSetupTest({
    appDirectory: sourceFolderPath,
    fileFolder: '__tests__',
    fileName: 'setup-test.ts',
  });

  await createVitestConfig(appDirectory);
  await createTsconfigSpec(appDirectory);
  await createGithubWorkflow(appDirectory);
};

const createVitestConfig = async (appDirectory: string) => {
  const content = `import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ['tsconfig.spec.json'],
      ignoreConfigErrors: true,
    }),
  ],
  test: {
    testTimeout: 120_000,
    hookTimeout: 120_000,
    fileParallelism: false,
    include: ['src/**/*.integration-test.ts'],
    setupFiles: ['src/__tests__/setup-test.ts'],
    env: {
      TWENTY_API_URL: process.env.TWENTY_API_URL ?? 'http://localhost:2020',
      TWENTY_API_KEY:
        '${SEED_API_KEY}',
    },
  },
});
`;

  await fs.writeFile(join(appDirectory, 'vitest.config.ts'), content);
};

const createTsconfigSpec = async (appDirectory: string) => {
  const tsconfigSpec = {
    extends: './tsconfig.json',
    compilerOptions: {
      composite: true,
      types: ['vitest/globals'],
    },
    include: ['src/**/*.ts', 'src/**/*.tsx'],
    exclude: ['node_modules', 'dist'],
  };

  await fs.writeFile(
    join(appDirectory, 'tsconfig.spec.json'),
    JSON.stringify(tsconfigSpec, null, 2),
  );

  const tsconfigPath = join(appDirectory, 'tsconfig.json');
  const tsconfig = await fs.readJson(tsconfigPath);

  tsconfig.references = [{ path: './tsconfig.spec.json' }];

  await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
};

const createSetupTest = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const content = `import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { beforeAll } from 'vitest';

const TWENTY_API_URL = process.env.TWENTY_API_URL ?? 'http://localhost:2020';
const TWENTY_API_KEY = process.env.TWENTY_API_KEY;
const TEST_CONFIG_PATH = path.join(os.homedir(), '.twenty', 'config.test.json');

const validateEnv = (): { apiUrl: string; apiKey: string } => {
  if (!TWENTY_API_URL || !TWENTY_API_KEY) {
    throw new Error(
      'TWENTY_API_URL and TWENTY_API_KEY must be set. ' +
        'Start a Twenty server before executing integration tests.',
    );
  }

  return { apiUrl: TWENTY_API_URL, apiKey: TWENTY_API_KEY };
};

const assertServerIsReachable = async (apiUrl: string) => {
  let response: Response;

  try {
    response = await fetch(\`\${apiUrl}/healthz\`);
  } catch {
    throw new Error(
      \`Twenty server is not reachable at \${apiUrl}. \` +
        'Make sure the server is running before executing integration tests.',
    );
  }

  if (!response.ok) {
    throw new Error(\`Server at \${apiUrl} returned \${response.status}\`);
  }
};

beforeAll(async () => {
  const { apiUrl, apiKey } = validateEnv();

  await assertServerIsReachable(apiUrl);

  fs.mkdirSync(path.dirname(TEST_CONFIG_PATH), { recursive: true });

  const configFile = {
    version: 1,
    remotes: {
      local: {
        apiUrl,
        apiKey,
      },
    },
    defaultRemote: 'local',
  };

  fs.writeFileSync(
    TEST_CONFIG_PATH,
    JSON.stringify(configFile, null, 2),
  );
});
`;

  await fs.ensureDir(join(appDirectory, fileFolder ?? ''));
  await fs.writeFile(join(appDirectory, fileFolder ?? '', fileName), content);
};

const createIntegrationTest = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const content = `import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/application-config';
import { appBuild, appDeploy, appInstall, appUninstall } from 'twenty-sdk/cli';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const APP_PATH = process.cwd();
const TWENTY_API_URL = process.env.TWENTY_API_URL ?? 'http://localhost:2020';
const TWENTY_API_KEY = process.env.TWENTY_API_KEY;
const ALREADY_DEPLOYED_VERSION_MESSAGE =
  'version must be higher than the currently deployed version';

describe('App installation', () => {
  beforeAll(async () => {
    await appUninstall({ appPath: APP_PATH }).catch(() => undefined);

    const buildResult = await appBuild({
      appPath: APP_PATH,
      tarball: true,
      onProgress: (message: string) => console.log(\`[build] \${message}\`),
    });

    if (!buildResult.success) {
      throw new Error(
        \`Build failed: \${buildResult.error?.message ?? 'Unknown error'}\`,
      );
    }

    const deployResult = await appDeploy({
      tarballPath: buildResult.data.tarballPath!,
      serverUrl: TWENTY_API_URL,
      token: TWENTY_API_KEY,
      onProgress: (message: string) => console.log(\`[deploy] \${message}\`),
    });

    const isAlreadyDeployedVersion =
      !deployResult.success &&
      deployResult.error?.message.includes(ALREADY_DEPLOYED_VERSION_MESSAGE);

    if (!deployResult.success && !isAlreadyDeployedVersion) {
      throw new Error(
        \`Deploy failed: \${deployResult.error?.message ?? 'Unknown error'}\`,
      );
    }

    if (isAlreadyDeployedVersion) {
      console.warn('App version is already deployed; reusing it for install.');
    }

    const installResult = await appInstall({ appPath: APP_PATH });

    if (!installResult.success) {
      throw new Error(
        \`Install failed: \${installResult.error?.message ?? 'Unknown error'}\`,
      );
    }
  });

  afterAll(async () => {
    const uninstallResult = await appUninstall({ appPath: APP_PATH });

    if (!uninstallResult.success) {
      console.warn(
        \`App uninstall failed: \${uninstallResult.error?.message ?? 'Unknown error'}\`,
      );
    }
  });

  it('should find the installed app in the applications list', async () => {
    const metadataClient = new MetadataApiClient();

    const result = await metadataClient.query({
      findManyApplications: {
        id: true,
        name: true,
        universalIdentifier: true,
      },
    });

    const installedApp = result.findManyApplications.find(
      (application: { universalIdentifier: string }) =>
        application.universalIdentifier ===
        APPLICATION_UNIVERSAL_IDENTIFIER,
    );

    expect(installedApp).toBeDefined();
  });
});
`;

  await fs.ensureDir(join(appDirectory, fileFolder ?? ''));
  await fs.writeFile(join(appDirectory, fileFolder ?? '', fileName), content);
};

const DEFAULT_TWENTY_VERSION = 'latest';

const createGithubWorkflow = async (appDirectory: string) => {
  const content = `name: CI

on:
  push:
    branches:
      - main
  pull_request: {}

env:
  TWENTY_VERSION: ${DEFAULT_TWENTY_VERSION}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Spawn Twenty instance
        id: twenty
        uses: twentyhq/twenty/.github/actions/spawn-twenty-docker-image@main
        with:
          twenty-version: \${{ env.TWENTY_VERSION }}
          github-token: \${{ secrets.GITHUB_TOKEN }}

      - name: Enable Corepack
        run: corepack enable

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --immutable

      - name: Run integration tests
        run: yarn test
        env:
          TWENTY_API_URL: \${{ steps.twenty.outputs.server-url }}
          TWENTY_API_KEY: \${{ steps.twenty.outputs.access-token }}
`;

  const workflowDir = join(appDirectory, '.github', 'workflows');

  await fs.ensureDir(workflowDir);
  await fs.writeFile(join(workflowDir, 'ci.yml'), content);
};
