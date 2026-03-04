// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';

const storybookDir =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const sdkRoot = path.resolve(storybookDir, '..');

const config: StorybookConfig = {
  stories: [
    '../src/front-component-renderer/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [getAbsolutePath('@storybook/addon-vitest')],

  framework: getAbsolutePath('@storybook/react-vite'),

  refs: {
    '@chakra-ui/react': { disable: true },
  },

  staticDirs: [
    {
      from: '../src/front-component-renderer/__stories__/example-sources-built',
      to: '/built',
    },
    {
      from: '../src/front-component-renderer/__stories__/example-sources-built-preact',
      to: '/built-preact',
    },
  ],

  viteFinal: async (viteConfig) => {
    return {
      ...viteConfig,
      resolve: {
        ...viteConfig.resolve,
        alias: {
          ...viteConfig.resolve?.alias,
          '@': path.resolve(storybookDir, '../src'),
        },
      },
      plugins: [
        ...(viteConfig.plugins ?? []),
        tsconfigPaths({ root: sdkRoot }),
      ],
      optimizeDeps: {
        ...viteConfig.optimizeDeps,
        include: [
          ...(viteConfig.optimizeDeps?.include ?? []),
          'transliteration',
          '@remote-dom/core/polyfill',
          '@remote-dom/react/polyfill',
          '@remote-dom/core/elements',
          '@remote-dom/react',
          'react-dom/client',
          'react/jsx-runtime',
        ],
      },
    };
  },
};

export default config;

function getAbsolutePath(value: string): string {
  return path.dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
