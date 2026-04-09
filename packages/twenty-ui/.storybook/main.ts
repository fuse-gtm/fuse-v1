// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import checker from 'vite-plugin-checker';

const storybookDir =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const isVitest = Boolean(process.env.VITEST);
const isTypeCheckerDisabled =
  process.env.VITE_DISABLE_TYPESCRIPT_CHECKER === 'true';

const config: StorybookConfig = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],

  addons: [
    getAbsolutePath('@storybook-community/storybook-addon-cookie'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-coverage'),
    getAbsolutePath('storybook-addon-pseudo-states'),
    getAbsolutePath('@storybook/addon-vitest'),
  ],

  framework: getAbsolutePath('@storybook/react-vite'),
  typescript: {
    check: false,
  },

  viteFinal: async (viteConfig) => {
    const plugins = [...(viteConfig.plugins ?? [])].filter((plugin) => {
      if (plugin == null || typeof plugin !== 'object' || !('name' in plugin)) {
        return true;
      }

      return plugin.name !== 'vite:dts';
    });
    const resolvedSharedPath = path.resolve(
      storybookDir,
      '../../twenty-shared/src',
    );
    const alias = [
      ...(Array.isArray(viteConfig.resolve?.alias)
        ? viteConfig.resolve.alias
        : Object.entries(viteConfig.resolve?.alias ?? {}).map(
            ([find, replacement]) => ({
              find,
              replacement,
            }),
          )),
      {
        find: 'twenty-shared/',
        replacement: `${resolvedSharedPath}/`,
      },
      {
        find: 'twenty-shared',
        replacement: path.join(resolvedSharedPath, 'index.ts'),
      },
      {
        find: '@/',
        replacement: `${resolvedSharedPath}/`,
      },
    ];

    if (!isVitest && !isTypeCheckerDisabled) {
      plugins.push(
        checker({
          typescript: {
            tsconfigPath: path.resolve(storybookDir, '../tsconfig.json'),
          },
        }),
      );
    }

    return {
      ...viteConfig,
      resolve: {
        ...viteConfig.resolve,
        alias,
      },
      plugins,
      resolve: {
        ...viteConfig.resolve,
        alias: {
          ...(viteConfig.resolve?.alias ?? {}),
          '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
        },
      },
    };
  },
};

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs

function getAbsolutePath(value: string): string {
  return path.dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
