import { type AppLocale } from '@/platform/i18n/locales';

import { WEBSITE_LOCALE_LIST } from './website-locale-list';

const WEBSITE_LOCALE_SET: ReadonlySet<AppLocale> = new Set(WEBSITE_LOCALE_LIST);

export const isWebsiteLocale = (locale: AppLocale): boolean =>
  WEBSITE_LOCALE_SET.has(locale);
