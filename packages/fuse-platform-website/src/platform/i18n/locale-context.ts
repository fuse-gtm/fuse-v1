'use client';

import { createContext } from 'react';
import { SOURCE_LOCALE, type AppLocale } from '@/platform/i18n/locales';

export const LocaleContext = createContext<AppLocale>(SOURCE_LOCALE);
