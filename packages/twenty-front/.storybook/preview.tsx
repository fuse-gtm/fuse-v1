import { ThemeProvider } from '@emotion/react';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { type Preview } from '@storybook/react-vite';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { useEffect } from 'react';
import { SOURCE_LOCALE } from 'twenty-shared/translations';
//import { useDarkMode } from 'storybook-dark-mode';

import { RootDecorator } from '../src/testing/decorators/RootDecorator';
import { resetJotaiStore } from '../src/modules/ui/utilities/state/jotai/jotaiStore';

import 'react-loading-skeleton/dist/skeleton.css';
import 'twenty-ui/style.css';
import { ThemeContextProvider } from 'twenty-ui/theme';
import { messages as enMessages } from '../src/locales/generated/en';
import {
  DEFAULT_DESIGN_OPTION_ID,
  DESIGN_OPTION_TOOLBAR_ITEMS,
  getDesignOptionTheme,
} from './designOptions';

// Initialize i18n globally for all stories
i18n.load({ [SOURCE_LOCALE]: enMessages });
i18n.activate(SOURCE_LOCALE);
import { mockedUserJWT } from '~/testing/mock-data/jwt';
import { ClickOutsideListenerContext } from '../src/modules/ui/utilities/pointer-event/contexts/ClickOutsideListenerContext';

initialize({
  onUnhandledRequest: async (request: Request) => {
    const fileExtensionsToIgnore =
      /\.(ts|tsx|js|jsx|svg|css|png|woff2)(\?v=[a-zA-Z0-9]+)?/;

    if (fileExtensionsToIgnore.test(request.url)) {
      return;
    }

    if (request.url.startsWith('http://localhost:3000/files/')) {
      return;
    }

    try {
      const requestBody = await request.json();

      // eslint-disable-next-line no-console
      console.warn(`Unhandled ${request.method} request to ${request.url}
        with payload ${JSON.stringify(requestBody)}\n
        This request should be mocked with MSW`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Cannot parse msw request body : ${error}`);
    }

    // eslint-disable-next-line no-console
    console.warn(
      `Unhandled ${request.method} request to ${request.url} \n  This request should be mocked with MSW`,
    );
  },
  quiet: true,
});

const preview: Preview = {
  decorators: [
    (Story, context) => {
      // const theme = useDarkMode() ? THEME_DARK : THEME_LIGHT;
      const designOptionId =
        context.globals.designOption ?? DEFAULT_DESIGN_OPTION_ID;
      const theme = getDesignOptionTheme(designOptionId);

      useEffect(() => {
        document.documentElement.className =
          theme.name === 'dark' ? 'dark' : 'light';
        document.documentElement.dataset.storybookDesign = designOptionId;
      }, [designOptionId, theme]);

      return (
        <I18nProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <ThemeContextProvider theme={theme}>
              <ClickOutsideListenerContext.Provider
                value={{ excludedClickOutsideId: undefined }}
              >
                <Story />
              </ClickOutsideListenerContext.Provider>
            </ThemeContextProvider>
          </ThemeProvider>
        </I18nProvider>
      );
    },
    RootDecorator,
  ],

  beforeEach: () => {
    resetJotaiStore();
  },

  loaders: [mswLoader],

  globalTypes: {
    designOption: {
      name: 'Design',
      description: 'Fuse design direction',
      defaultValue: DEFAULT_DESIGN_OPTION_ID,
      toolbar: {
        icon: 'paintbrush',
        items: DESIGN_OPTION_TOOLBAR_ITEMS,
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    mockingDate: new Date('2024-03-12T09:30:00.000Z'),
    options: {
      storySort: {
        order: ['UI', 'Modules', 'Pages'],
      },
    },
    cookie: {
      tokenPair: `{%22accessOrWorkspaceAgnosticToken%22:{%22token%22:%22${mockedUserJWT}%22%2C%22expiresAt%22:%222023-07-18T15:06:40.704Z%22%2C%22__typename%22:%22AuthToken%22}%2C%22refreshToken%22:{%22token%22:%22${mockedUserJWT}%22%2C%22expiresAt%22:%222023-10-15T15:06:41.558Z%22%2C%22__typename%22:%22AuthToken%22}%2C%22__typename%22:%22AuthTokenPair%22}`,
    },
  },
};

export default preview;
