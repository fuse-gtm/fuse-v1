import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const computeStoriesGlob = () => {
  if (process.env.STORYBOOK_SCOPE === 'pages') {
    return [
      '../src/pages/**/*.stories.@(js|jsx|ts|tsx)',
      '../src/__stories__/*.stories.@(js|jsx|ts|tsx)',
      '../src/pages/**/*.docs.mdx',
      '../src/__stories__/*.docs.mdx',
    ];
  }

  if (process.env.STORYBOOK_SCOPE === 'modules') {
    return [
      '../src/modules/**/!(perf)/*.stories.@(js|jsx|ts|tsx)',
      '../src/modules/**/*.docs.mdx',
    ];
  }

  if (process.env.STORYBOOK_SCOPE === 'performance') {
    return ['../src/modules/**/perf/*.perf.stories.@(js|jsx|ts|tsx)'];
  }

  if (process.env.STORYBOOK_SCOPE === 'ui-docs') {
    return [
      '../src/modules/ui/**/*.docs.mdx',
      '../src/modules/ui/**/__stories__/FuseDesignScorecard.stories.@(js|jsx|ts|tsx)',
    ];
  }

  return ['../src/**/*.docs.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'];
};

const config: StorybookConfig = {
  stories: computeStoriesGlob(),

  build: {
    test: {
      disabledAddons: [
        '@storybook/addon-docs',
        '@storybook/addon-essentials/docs',
      ],
    },
  },

  addons: [
    getAbsolutePath('@storybook-community/storybook-addon-cookie'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-coverage'),
    getAbsolutePath('storybook-addon-pseudo-states'),
    getAbsolutePath('storybook-addon-mock-date'),
    getAbsolutePath('@storybook/addon-vitest'),
  ],

  framework: getAbsolutePath('@storybook/react-vite'),

  viteFinal: async (viteConfig) => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(viteConfig, {
      logLevel: 'warn',
    });
  },

  logLevel: 'error',

  docs: {},
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
