import { copyBaseApplicationProject } from '@/utils/app-template';
import * as fs from 'fs-extra';
import { tmpdir } from 'os';
import createTwentyAppPackageJson from 'package.json';
import { join } from 'path';

jest.mock('fs-extra', () => {
  const actual = jest.requireActual('fs-extra');
  return {
    ...actual,
    copy: jest.fn().mockResolvedValue(undefined),
  };
});

const UNIVERSAL_IDENTIFIERS_PATH = join(
  'src',
  'constants',
  'universal-identifiers.ts',
);

// Template content matching template/src/constants/universal-identifiers.ts
const TEMPLATE_UNIVERSAL_IDENTIFIERS = `export const APP_DISPLAY_NAME = 'DISPLAY-NAME-TO-BE-GENERATED';
export const APP_DESCRIPTION = 'DESCRIPTION-TO-BE-GENERATED';
export const APPLICATION_UNIVERSAL_IDENTIFIER = 'UUID-TO-BE-GENERATED';
export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER = 'UUID-TO-BE-GENERATED';
`;

// Template package.json matching template/package.json
const TEMPLATE_PACKAGE_JSON = {
  name: 'template-app',
  version: '0.1.0',
  license: 'MIT',
  scripts: { twenty: 'twenty' },
  dependencies: {
    'twenty-sdk': '0.0.0',
    'twenty-client-sdk': '0.0.0',
  },
};

describe('copyBaseApplicationProject', () => {
  let testAppDirectory: string;

  beforeEach(async () => {
    testAppDirectory = join(
      tmpdir(),
      `test-twenty-app-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );
    await fs.ensureDir(testAppDirectory);

    // Seed the files that generateUniversalIdentifiers and updatePackageJson
    // expect to find (since fs.copy is mocked and won't actually create them)
    await fs.ensureDir(join(testAppDirectory, 'src', 'constants'));
    await fs.writeFile(
      join(testAppDirectory, UNIVERSAL_IDENTIFIERS_PATH),
      TEMPLATE_UNIVERSAL_IDENTIFIERS,
    );
    await fs.writeJson(
      join(testAppDirectory, 'package.json'),
      TEMPLATE_PACKAGE_JSON,
    );

    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (testAppDirectory && (await fs.pathExists(testAppDirectory))) {
      await fs.remove(testAppDirectory);
    }
  });

  it('should create the correct folder structure with src/', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: 'A test application',
      appDirectory: testAppDirectory,
      exampleOptions: ALL_EXAMPLES,
    });

    const srcAppPath = join(testAppDirectory, 'src');
    expect(await fs.pathExists(srcAppPath)).toBe(true);

    const appConfigPath = join(srcAppPath, APPLICATION_FILE_NAME);
    expect(await fs.pathExists(appConfigPath)).toBe(true);

    const roleConfigPath = join(srcAppPath, 'roles', DEFAULT_ROLE_FILE_NAME);
    expect(await fs.pathExists(roleConfigPath)).toBe(true);
  });

  it('should create package.json with correct content', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: 'A test application',
      appDirectory: testAppDirectory,
      exampleOptions: ALL_EXAMPLES,
    });

    const packageJsonPath = join(testAppDirectory, 'package.json');
    expect(await fs.pathExists(packageJsonPath)).toBe(true);

    const packageJson = await fs.readJson(packageJsonPath);
    expect(packageJson.name).toBe('my-test-app');
    expect(packageJson.version).toBe('0.1.0');
    expect(packageJson.devDependencies['twenty-sdk']).toBe(
      createTwentyAppPackageJson.version,
    );
    expect(packageJson.devDependencies['twenty-client-sdk']).toBe(
      createTwentyAppPackageJson.version,
    );
    expect(packageJson.scripts['twenty']).toBe('twenty');
  });

  it('should create .gitignore file', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: 'A test application',
      appDirectory: testAppDirectory,
      exampleOptions: ALL_EXAMPLES,
    });

    const gitignorePath = join(testAppDirectory, '.gitignore');
    expect(await fs.pathExists(gitignorePath)).toBe(true);

    const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
    expect(gitignoreContent).toContain('/node_modules');
    expect(gitignoreContent).toContain(GENERATED_DIR);
  });

  it('should create yarn.lock file', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: 'A test application',
      appDirectory: testAppDirectory,
      exampleOptions: ALL_EXAMPLES,
    });

    const yarnLockPath = join(testAppDirectory, 'yarn.lock');
    expect(await fs.pathExists(yarnLockPath)).toBe(true);

    const yarnLockContent = await fs.readFile(yarnLockPath, 'utf8');
    expect(yarnLockContent).toContain('yarn lockfile v1');
  });

  it('should create application-config.ts with defineApplication and correct values', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: 'A test application',
      appDirectory: testAppDirectory,
      exampleOptions: ALL_EXAMPLES,
    });

    const appConfigPath = join(testAppDirectory, 'src', APPLICATION_FILE_NAME);
    const appConfigContent = await fs.readFile(appConfigPath, 'utf8');

    expect(appConfigContent).toContain(
      "import { defineApplication } from 'twenty-sdk'",
    );
    expect(appConfigContent).toContain('export default defineApplication({');

    expect(appConfigContent).toContain(
      "import { DEFAULT_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/default-role'",
    );

    expect(appConfigContent).toContain(
      'export const APPLICATION_UNIVERSAL_IDENTIFIER',
    );
    expect(appConfigContent).toContain(
      'universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER',
    );

    expect(appConfigContent).toContain("displayName: 'My Test App'");
    expect(appConfigContent).toContain("description: 'A test application'");

    expect(appConfigContent).toMatch(
      /APPLICATION_UNIVERSAL_IDENTIFIER =\s*'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'/,
    );

    expect(appConfigContent).toContain(
      'defaultRoleUniversalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER',
    );
  });

  it('should create default-role.ts with defineRole and correct values', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: 'A test application',
      appDirectory: testAppDirectory,
      exampleOptions: ALL_EXAMPLES,
    });

    const roleConfigPath = join(
      testAppDirectory,
      'src',
      'roles',
      DEFAULT_ROLE_FILE_NAME,
    );
    const roleConfigContent = await fs.readFile(roleConfigPath, 'utf8');

    expect(roleConfigContent).toContain(
      "import { defineRole } from 'twenty-sdk'",
    );
    expect(roleConfigContent).toContain('export default defineRole({');

    expect(roleConfigContent).toContain(
      'export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER',
    );

    expect(roleConfigContent).toContain(
      "label: 'My Test App default function role'",
    );

    expect(roleConfigContent).toContain('canReadAllObjectRecords: true');
    expect(roleConfigContent).toContain('canUpdateAllObjectRecords: true');
    expect(roleConfigContent).toContain('canSoftDeleteAllObjectRecords: true');
    expect(roleConfigContent).toContain('canDestroyAllObjectRecords: false');

    expect(roleConfigContent).toMatch(
      /universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER/,
    );
  });

  it('should call fs.copy to copy base application template', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: 'A test application',
      appDirectory: testAppDirectory,
    });

    expect(fs.copy).toHaveBeenCalledTimes(1);
    expect(fs.copy).toHaveBeenCalledWith(
      expect.stringContaining('template'),
      testAppDirectory,
    );
  });

  it('should replace placeholders in universal-identifiers.ts with real values', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: 'A test application',
      appDirectory: testAppDirectory,
    });

    const content = await fs.readFile(
      join(testAppDirectory, UNIVERSAL_IDENTIFIERS_PATH),
      'utf8',
    );

    expect(content).toContain("APP_DISPLAY_NAME = 'My Test App'");
    expect(content).toContain("APP_DESCRIPTION = 'A test application'");
    expect(content).not.toContain('DISPLAY-NAME-TO-BE-GENERATED');
    expect(content).not.toContain('DESCRIPTION-TO-BE-GENERATED');
    expect(content).not.toContain('UUID-TO-BE-GENERATED');

    // Both UUIDs should be valid v4 format
    const uuidMatches = content.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
    );
    expect(uuidMatches).toHaveLength(2);
  });

  it('should generate different UUIDs for each identifier', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: 'A test application',
      appDirectory: testAppDirectory,
    });

    const content = await fs.readFile(
      join(testAppDirectory, UNIVERSAL_IDENTIFIERS_PATH),
      'utf8',
    );

    const uuidMatches = content.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
    );
    expect(uuidMatches).toHaveLength(2);
    expect(uuidMatches![0]).not.toBe(uuidMatches![1]);
  });

  it('should update package.json with app name and SDK versions', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: 'A test application',
      appDirectory: testAppDirectory,
    });

    const packageJson = await fs.readJson(
      join(testAppDirectory, 'package.json'),
    );
    expect(packageJson.name).toBe('my-test-app');
    expect(packageJson.dependencies['twenty-sdk']).toBe(
      createTwentyAppPackageJson.version,
    );
    expect(packageJson.dependencies['twenty-client-sdk']).toBe(
      createTwentyAppPackageJson.version,
    );
  });

  it('should create an empty public directory in the scaffolded project', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: 'A test application',
      appDirectory: testAppDirectory,
    });

    const publicDirectoryPath = join(testAppDirectory, 'public');

    expect(await fs.pathExists(publicDirectoryPath)).toBe(true);

    const publicDirectoryStats = await fs.stat(publicDirectoryPath);
    expect(publicDirectoryStats.isDirectory()).toBe(true);

    const publicDirectoryContents = await fs.readdir(publicDirectoryPath);
    expect(publicDirectoryContents).toHaveLength(0);
  });

  it('should handle empty description', async () => {
    await copyBaseApplicationProject({
      appName: 'my-test-app',
      appDisplayName: 'My Test App',
      appDescription: '',
      appDirectory: testAppDirectory,
    });

    const content = await fs.readFile(
      join(testAppDirectory, UNIVERSAL_IDENTIFIERS_PATH),
      'utf8',
    );

    expect(content).toContain("APP_DESCRIPTION = ''");
  });

  it('should generate unique UUIDs across different scaffolds', async () => {
    const firstAppDir = join(testAppDirectory, 'app1');
    await fs.ensureDir(join(firstAppDir, 'src', 'constants'));
    await fs.writeFile(
      join(firstAppDir, UNIVERSAL_IDENTIFIERS_PATH),
      TEMPLATE_UNIVERSAL_IDENTIFIERS,
    );
    await fs.writeJson(
      join(firstAppDir, 'package.json'),
      TEMPLATE_PACKAGE_JSON,
    );
    await copyBaseApplicationProject({
      appName: 'app-one',
      appDisplayName: 'App One',
      appDescription: 'First app',
      appDirectory: firstAppDir,
    });

    const secondAppDir = join(testAppDirectory, 'app2');
    await fs.ensureDir(join(secondAppDir, 'src', 'constants'));
    await fs.writeFile(
      join(secondAppDir, UNIVERSAL_IDENTIFIERS_PATH),
      TEMPLATE_UNIVERSAL_IDENTIFIERS,
    );
    await fs.writeJson(
      join(secondAppDir, 'package.json'),
      TEMPLATE_PACKAGE_JSON,
    );
    await copyBaseApplicationProject({
      appName: 'app-two',
      appDisplayName: 'App Two',
      appDescription: 'Second app',
      appDirectory: secondAppDir,
    });

    const firstConstants = await fs.readFile(
      join(firstAppDir, UNIVERSAL_IDENTIFIERS_PATH),
      'utf8',
    );
    const secondConstants = await fs.readFile(
      join(secondAppDir, UNIVERSAL_IDENTIFIERS_PATH),
      'utf8',
    );

    const uuidRegex =
      /APPLICATION_UNIVERSAL_IDENTIFIER = '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'/;
    const firstUuid = firstConstants.match(uuidRegex)?.[1];
    const secondUuid = secondConstants.match(uuidRegex)?.[1];

    expect(firstUuid).toBeDefined();
    expect(secondUuid).toBeDefined();
    expect(firstUuid).not.toBe(secondUuid);
  });

  it('should generate unique role UUIDs for each application', async () => {
    const firstAppDir = join(testAppDirectory, 'app1');
    await fs.ensureDir(firstAppDir);
    await seedTsconfig(firstAppDir);
    await copyBaseApplicationProject({
      appName: 'app-one',
      appDisplayName: 'App One',
      appDescription: 'First app',
      appDirectory: firstAppDir,
      exampleOptions: ALL_EXAMPLES,
    });

    const secondAppDir = join(testAppDirectory, 'app2');
    await fs.ensureDir(secondAppDir);
    await seedTsconfig(secondAppDir);
    await copyBaseApplicationProject({
      appName: 'app-two',
      appDisplayName: 'App Two',
      appDescription: 'Second app',
      appDirectory: secondAppDir,
      exampleOptions: ALL_EXAMPLES,
    });

    const firstRoleConfig = await fs.readFile(
      join(firstAppDir, 'src', 'roles', DEFAULT_ROLE_FILE_NAME),
      'utf8',
    );

    const secondRoleConfig = await fs.readFile(
      join(secondAppDir, 'src', 'roles', DEFAULT_ROLE_FILE_NAME),
      'utf8',
    );

    const uuidRegex =
      /DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =\s*'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'/;
    const firstUuid = firstRoleConfig.match(uuidRegex)?.[1];
    const secondUuid = secondRoleConfig.match(uuidRegex)?.[1];

    expect(firstUuid).toBeDefined();
    expect(secondUuid).toBeDefined();
    expect(firstUuid).not.toBe(secondUuid);
  });

  describe('scaffolding modes', () => {
    describe('exhaustive mode (all examples)', () => {
      it('should create all example files when all options are enabled', async () => {
        await copyBaseApplicationProject({
          appName: 'my-test-app',
          appDisplayName: 'My Test App',
          appDescription: 'A test application',
          appDirectory: testAppDirectory,
          exampleOptions: ALL_EXAMPLES,
        });

        const srcPath = join(testAppDirectory, 'src');

        expect(
          await fs.pathExists(join(srcPath, 'objects', 'example-object.ts')),
        ).toBe(true);
        expect(
          await fs.pathExists(join(srcPath, 'fields', 'example-field.ts')),
        ).toBe(true);
        expect(
          await fs.pathExists(
            join(srcPath, 'logic-functions', 'hello-world.ts'),
          ),
        ).toBe(true);
        expect(
          await fs.pathExists(
            join(srcPath, 'logic-functions', 'create-hello-world-company.ts'),
          ),
        ).toBe(true);
        expect(
          await fs.pathExists(
            join(srcPath, 'front-components', 'hello-world.tsx'),
          ),
        ).toBe(true);
        expect(
          await fs.pathExists(
            join(srcPath, 'page-layouts', 'example-record-page-layout.ts'),
          ),
        ).toBe(true);
        expect(
          await fs.pathExists(join(srcPath, 'views', 'example-view.ts')),
        ).toBe(true);
        expect(
          await fs.pathExists(
            join(
              srcPath,
              'navigation-menu-items',
              'example-navigation-menu-item.ts',
            ),
          ),
        ).toBe(true);

        expect(
          await fs.pathExists(
            join(srcPath, '__tests__', 'app-install.integration-test.ts'),
          ),
        ).toBe(true);

        expect(
          await fs.pathExists(
            join(testAppDirectory, '.github', 'workflows', 'ci.yml'),
          ),
        ).toBe(true);

        // Install functions should always exist
        expect(
          await fs.pathExists(
            join(srcPath, 'logic-functions', 'pre-install.ts'),
          ),
        ).toBe(true);
        expect(
          await fs.pathExists(
            join(srcPath, 'logic-functions', 'post-install.ts'),
          ),
        ).toBe(true);
      });
    });

    describe('minimal mode (no examples)', () => {
      it('should create only core files when no examples are enabled', async () => {
        await copyBaseApplicationProject({
          appName: 'my-test-app',
          appDisplayName: 'My Test App',
          appDescription: 'A test application',
          appDirectory: testAppDirectory,
          exampleOptions: NO_EXAMPLES,
        });

        const srcPath = join(testAppDirectory, 'src');

        expect(await fs.pathExists(join(srcPath, APPLICATION_FILE_NAME))).toBe(
          true,
        );
        expect(
          await fs.pathExists(join(srcPath, 'roles', DEFAULT_ROLE_FILE_NAME)),
        ).toBe(true);

        // Install functions should always exist (not gated by exampleOptions)
        expect(
          await fs.pathExists(
            join(srcPath, 'logic-functions', 'pre-install.ts'),
          ),
        ).toBe(true);
        expect(
          await fs.pathExists(
            join(srcPath, 'logic-functions', 'post-install.ts'),
          ),
        ).toBe(true);

        expect(
          await fs.pathExists(join(srcPath, 'objects', 'example-object.ts')),
        ).toBe(false);
        expect(
          await fs.pathExists(join(srcPath, 'fields', 'example-field.ts')),
        ).toBe(false);
        expect(
          await fs.pathExists(
            join(srcPath, 'logic-functions', 'hello-world.ts'),
          ),
        ).toBe(false);
        expect(
          await fs.pathExists(
            join(srcPath, 'logic-functions', 'create-hello-world-company.ts'),
          ),
        ).toBe(false);
        expect(
          await fs.pathExists(
            join(srcPath, 'front-components', 'hello-world.tsx'),
          ),
        ).toBe(false);
        expect(
          await fs.pathExists(
            join(srcPath, 'page-layouts', 'example-record-page-layout.ts'),
          ),
        ).toBe(false);
        expect(
          await fs.pathExists(join(srcPath, 'views', 'example-view.ts')),
        ).toBe(false);
        expect(
          await fs.pathExists(
            join(
              srcPath,
              'navigation-menu-items',
              'example-navigation-menu-item.ts',
            ),
          ),
        ).toBe(false);
        expect(
          await fs.pathExists(
            join(srcPath, '__tests__', 'app-install.integration-test.ts'),
          ),
        ).toBe(false);

        expect(
          await fs.pathExists(
            join(testAppDirectory, '.github', 'workflows', 'ci.yml'),
          ),
        ).toBe(false);
      });
    });

    describe('selective examples', () => {
      it('should create front component and page layout when only front component option is enabled', async () => {
        await copyBaseApplicationProject({
          appName: 'my-test-app',
          appDisplayName: 'My Test App',
          appDescription: 'A test application',
          appDirectory: testAppDirectory,
          exampleOptions: {
            includeExampleObject: false,
            includeExampleField: false,
            includeExampleSkill: false,
            includeExampleAgent: false,
            includeExampleLogicFunction: false,
            includeExampleFrontComponent: true,
            includeExampleView: false,
            includeExampleNavigationMenuItem: false,
            includeExampleIntegrationTest: false,
          },
        });

        const srcPath = join(testAppDirectory, 'src');

        expect(
          await fs.pathExists(
            join(srcPath, 'front-components', 'hello-world.tsx'),
          ),
        ).toBe(true);
        expect(
          await fs.pathExists(
            join(srcPath, 'page-layouts', 'example-record-page-layout.ts'),
          ),
        ).toBe(true);
        expect(
          await fs.pathExists(join(srcPath, 'objects', 'example-object.ts')),
        ).toBe(false);
        expect(
          await fs.pathExists(join(srcPath, 'fields', 'example-field.ts')),
        ).toBe(false);
        expect(
          await fs.pathExists(
            join(srcPath, 'logic-functions', 'hello-world.ts'),
          ),
        ).toBe(false);
      });

      it('should create only logic function when only that option is enabled', async () => {
        await copyBaseApplicationProject({
          appName: 'my-test-app',
          appDisplayName: 'My Test App',
          appDescription: 'A test application',
          appDirectory: testAppDirectory,
          exampleOptions: {
            includeExampleObject: false,
            includeExampleSkill: false,
            includeExampleAgent: false,
            includeExampleField: false,
            includeExampleLogicFunction: true,
            includeExampleFrontComponent: false,
            includeExampleView: false,
            includeExampleNavigationMenuItem: false,
            includeExampleIntegrationTest: false,
          },
        });

        const srcPath = join(testAppDirectory, 'src');

        expect(
          await fs.pathExists(
            join(srcPath, 'logic-functions', 'hello-world.ts'),
          ),
        ).toBe(true);
        expect(
          await fs.pathExists(
            join(srcPath, 'logic-functions', 'create-hello-world-company.ts'),
          ),
        ).toBe(true);
        expect(
          await fs.pathExists(join(srcPath, 'objects', 'example-object.ts')),
        ).toBe(false);
      });
    });
  });

  describe('example object', () => {
    it('should create example-object.ts with defineObject and correct structure', async () => {
      await copyBaseApplicationProject({
        appName: 'my-test-app',
        appDisplayName: 'My Test App',
        appDescription: 'A test application',
        appDirectory: testAppDirectory,
        exampleOptions: ALL_EXAMPLES,
      });

      const objectPath = join(
        testAppDirectory,
        'src',
        'objects',
        'example-object.ts',
      );

      expect(await fs.pathExists(objectPath)).toBe(true);

      const content = await fs.readFile(objectPath, 'utf8');

      expect(content).toContain(
        "import { defineObject, FieldType } from 'twenty-sdk'",
      );
      expect(content).toContain('export default defineObject({');
      expect(content).toContain(
        'export const EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER',
      );
      expect(content).toContain('export const NAME_FIELD_UNIVERSAL_IDENTIFIER');
      expect(content).toContain("nameSingular: 'exampleItem'");
      expect(content).toContain("namePlural: 'exampleItems'");
      expect(content).toContain('FieldType.TEXT');
      expect(content).toContain(
        'labelIdentifierFieldMetadataUniversalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER',
      );
    });

    it('should generate unique UUIDs for example objects across apps', async () => {
      const firstAppDir = join(testAppDirectory, 'app1');
      await fs.ensureDir(firstAppDir);
      await seedTsconfig(firstAppDir);
      await copyBaseApplicationProject({
        appName: 'app-one',
        appDisplayName: 'App One',
        appDescription: 'First app',
        appDirectory: firstAppDir,
        exampleOptions: ALL_EXAMPLES,
      });

      const secondAppDir = join(testAppDirectory, 'app2');
      await fs.ensureDir(secondAppDir);
      await seedTsconfig(secondAppDir);
      await copyBaseApplicationProject({
        appName: 'app-two',
        appDisplayName: 'App Two',
        appDescription: 'Second app',
        appDirectory: secondAppDir,
        exampleOptions: ALL_EXAMPLES,
      });

      const firstContent = await fs.readFile(
        join(firstAppDir, 'src', 'objects', 'example-object.ts'),
        'utf8',
      );
      const secondContent = await fs.readFile(
        join(secondAppDir, 'src', 'objects', 'example-object.ts'),
        'utf8',
      );

      const uuidRegex =
        /EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER =\s*'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'/;
      const firstUuid = firstContent.match(uuidRegex)?.[1];
      const secondUuid = secondContent.match(uuidRegex)?.[1];

      expect(firstUuid).toBeDefined();
      expect(secondUuid).toBeDefined();
      expect(firstUuid).not.toBe(secondUuid);
    });
  });

  describe('example field', () => {
    it('should create example-field.ts with defineField referencing the object', async () => {
      await copyBaseApplicationProject({
        appName: 'my-test-app',
        appDisplayName: 'My Test App',
        appDescription: 'A test application',
        appDirectory: testAppDirectory,
        exampleOptions: ALL_EXAMPLES,
      });

      const fieldPath = join(
        testAppDirectory,
        'src',
        'fields',
        'example-field.ts',
      );

      expect(await fs.pathExists(fieldPath)).toBe(true);

      const content = await fs.readFile(fieldPath, 'utf8');

      expect(content).toContain(
        "import { defineField, FieldType } from 'twenty-sdk'",
      );
      expect(content).toContain(
        "import { EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER } from 'src/objects/example-object'",
      );
      expect(content).toContain('export default defineField({');
      expect(content).toContain(
        'objectUniversalIdentifier: EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER',
      );
      expect(content).toContain('FieldType.NUMBER');
      expect(content).toContain("name: 'priority'");
    });
  });

  describe('example view', () => {
    it('should create example-view.ts with defineView referencing the object', async () => {
      await copyBaseApplicationProject({
        appName: 'my-test-app',
        appDisplayName: 'My Test App',
        appDescription: 'A test application',
        appDirectory: testAppDirectory,
        exampleOptions: ALL_EXAMPLES,
      });

      const viewPath = join(
        testAppDirectory,
        'src',
        'views',
        'example-view.ts',
      );

      expect(await fs.pathExists(viewPath)).toBe(true);

      const content = await fs.readFile(viewPath, 'utf8');

      expect(content).toContain(
        "import { defineView, ViewKey } from 'twenty-sdk'",
      );
      expect(content).toContain(
        "import { EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER, NAME_FIELD_UNIVERSAL_IDENTIFIER } from 'src/objects/example-object'",
      );
      expect(content).toContain('export default defineView({');
      expect(content).toContain(
        'objectUniversalIdentifier: EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER',
      );
      expect(content).toContain("name: 'All example items'");
      expect(content).toContain('fields: [');
      expect(content).toContain(
        'fieldMetadataUniversalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER',
      );
      expect(content).toContain('isVisible: true');
      expect(content).toContain('key: ViewKey.INDEX');
      expect(content).toContain('size: 200');
    });
  });

  describe('example navigation menu item', () => {
    it('should create example-navigation-menu-item.ts with defineNavigationMenuItem', async () => {
      await copyBaseApplicationProject({
        appName: 'my-test-app',
        appDisplayName: 'My Test App',
        appDescription: 'A test application',
        appDirectory: testAppDirectory,
        exampleOptions: ALL_EXAMPLES,
      });

      const navPath = join(
        testAppDirectory,
        'src',
        'navigation-menu-items',
        'example-navigation-menu-item.ts',
      );

      expect(await fs.pathExists(navPath)).toBe(true);

      const content = await fs.readFile(navPath, 'utf8');

      expect(content).toContain(
        "import { defineNavigationMenuItem } from 'twenty-sdk'",
      );
      expect(content).toContain('export default defineNavigationMenuItem({');
      expect(content).toContain("name: 'example-navigation-menu-item'");
      expect(content).toContain("icon: 'IconList'");
      expect(content).toContain("color: 'blue'");
      expect(content).toContain('position: 0');
    });
  });

  describe('pre-install logic function', () => {
    it('should create pre-install.ts with definePreInstallLogicFunction and typed payload', async () => {
      await copyBaseApplicationProject({
        appName: 'my-test-app',
        appDisplayName: 'My Test App',
        appDescription: 'A test application',
        appDirectory: testAppDirectory,
        exampleOptions: NO_EXAMPLES,
      });

      const preInstallPath = join(
        testAppDirectory,
        'src',
        'logic-functions',
        'pre-install.ts',
      );

      expect(await fs.pathExists(preInstallPath)).toBe(true);

      const content = await fs.readFile(preInstallPath, 'utf8');

      expect(content).toContain(
        "import { definePreInstallLogicFunction, type InstallLogicFunctionPayload } from 'twenty-sdk'",
      );
      expect(content).toContain(
        'export default definePreInstallLogicFunction({',
      );
      expect(content).toContain("name: 'pre-install'");
      expect(content).toContain('timeoutSeconds: 300');
      expect(content).toContain(
        'const handler = async (payload: InstallLogicFunctionPayload): Promise<void>',
      );
      expect(content).toContain('payload.previousVersion');

      // Verify it has a universalIdentifier (UUID format)
      expect(content).toMatch(
        /universalIdentifier: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'/,
      );
    });

    it('should always create pre-install.ts regardless of example options', async () => {
      await copyBaseApplicationProject({
        appName: 'my-test-app',
        appDisplayName: 'My Test App',
        appDescription: 'A test application',
        appDirectory: testAppDirectory,
        exampleOptions: NO_EXAMPLES,
      });

      const preInstallPath = join(
        testAppDirectory,
        'src',
        'logic-functions',
        'pre-install.ts',
      );

      expect(await fs.pathExists(preInstallPath)).toBe(true);
    });
  });

  describe('integration test', () => {
    it('should include vitest and test scripts in package.json when enabled', async () => {
      await copyBaseApplicationProject({
        appName: 'my-test-app',
        appDisplayName: 'My Test App',
        appDescription: 'A test application',
        appDirectory: testAppDirectory,
        exampleOptions: ALL_EXAMPLES,
      });

      const packageJson = await fs.readJson(
        join(testAppDirectory, 'package.json'),
      );

      expect(packageJson.scripts.test).toBe('vitest run');
      expect(packageJson.scripts['test:watch']).toBe('vitest');
      expect(packageJson.devDependencies.vitest).toBeDefined();
    });

    it('should not include vitest or test scripts when disabled', async () => {
      await copyBaseApplicationProject({
        appName: 'my-test-app',
        appDisplayName: 'My Test App',
        appDescription: 'A test application',
        appDirectory: testAppDirectory,
        exampleOptions: NO_EXAMPLES,
      });

      const packageJson = await fs.readJson(
        join(testAppDirectory, 'package.json'),
      );

      expect(packageJson.scripts.test).toBeUndefined();
      expect(packageJson.scripts['test:watch']).toBeUndefined();
      expect(packageJson.devDependencies.vitest).toBeUndefined();
    });
  });

  describe('post-install logic function', () => {
    it('should create post-install.ts with definePostInstallLogicFunction and typed payload', async () => {
      await copyBaseApplicationProject({
        appName: 'my-test-app',
        appDisplayName: 'My Test App',
        appDescription: 'A test application',
        appDirectory: testAppDirectory,
        exampleOptions: NO_EXAMPLES,
      });

      const postInstallPath = join(
        testAppDirectory,
        'src',
        'logic-functions',
        'post-install.ts',
      );

      expect(await fs.pathExists(postInstallPath)).toBe(true);

      const content = await fs.readFile(postInstallPath, 'utf8');

      expect(content).toContain(
        "import { definePostInstallLogicFunction, type InstallLogicFunctionPayload } from 'twenty-sdk'",
      );
      expect(content).toContain(
        'export default definePostInstallLogicFunction({',
      );
      expect(content).toContain("name: 'post-install'");
      expect(content).toContain('timeoutSeconds: 300');
      expect(content).toContain(
        'const handler = async (payload: InstallLogicFunctionPayload): Promise<void>',
      );
      expect(content).toContain('payload.previousVersion');

      // Verify it has a universalIdentifier (UUID format)
      expect(content).toMatch(
        /universalIdentifier: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'/,
      );
    });

    it('should always create post-install.ts regardless of example options', async () => {
      await copyBaseApplicationProject({
        appName: 'my-test-app',
        appDisplayName: 'My Test App',
        appDescription: 'A test application',
        appDirectory: testAppDirectory,
        exampleOptions: NO_EXAMPLES,
      });

      const postInstallPath = join(
        testAppDirectory,
        'src',
        'logic-functions',
        'post-install.ts',
      );

      expect(await fs.pathExists(postInstallPath)).toBe(true);
    });
  });
});
