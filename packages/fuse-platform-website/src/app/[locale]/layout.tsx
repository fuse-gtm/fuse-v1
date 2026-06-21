import { Aleo, Azeret_Mono, Host_Grotesk, VT323 } from 'next/font/google';
import { type ReactNode } from 'react';

import { getLocaleMessages } from '@/platform/i18n/get-locale-messages';
import {
  getRouteI18n,
  type LocaleRouteParams,
} from '@/platform/i18n/get-route-i18n';
import { ContactCalModalRoot } from '@/contact-cal';
import { I18nProvider } from '@/platform/i18n/I18nProvider';
import { localeToUrlSegment } from '@/platform/i18n/locale-to-url-segment';
import { resolveLocaleParam } from '@/platform/i18n/resolve-locale-param';
import { WEBSITE_LOCALE_LIST } from '@/platform/i18n/website-locale-list';
import { buildCssVariableDeclarations } from '@/tokens/build-css-variable-declarations';
import { color } from '@/tokens/color';
import { fontFamily } from '@/tokens/font-family';

const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const aleo = Aleo({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-serif',
  display: 'swap',
});

const azeretMono = Azeret_Mono({
  subsets: ['latin'],
  weight: ['300', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-retro',
  display: 'swap',
});

const globalStyles = `
  :root {
    ${buildCssVariableDeclarations()}
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${color('white')};
    color: ${color('black')};
    font-family: ${fontFamily('sans')};
    min-height: 100vh;
    min-height: 100dvh;
    -webkit-font-smoothing: antialiased;
  }
`;

export const dynamicParams = false;

export const generateStaticParams = (): LocaleRouteParams[] =>
  WEBSITE_LOCALE_LIST.map((locale) => ({
    locale: localeToUrlSegment(locale),
  }));

const LocaleLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<LocaleRouteParams>;
}) => {
  await getRouteI18n(params);
  const locale = resolveLocaleParam((await params).locale);

  return (
    <html lang={locale}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body
        className={`${hostGrotesk.variable} ${aleo.variable} ${azeretMono.variable} ${vt323.variable}`}
      >
        <I18nProvider locale={locale} messages={getLocaleMessages(locale)}>
          <ContactCalModalRoot>{children}</ContactCalModalRoot>
        </I18nProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
