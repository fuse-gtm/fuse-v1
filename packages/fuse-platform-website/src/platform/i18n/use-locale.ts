'use client';

import { useContext } from 'react';
import { type AppLocale } from '@/platform/i18n/locales';

import { LocaleContext } from './locale-context';

export const useLocale = (): AppLocale => useContext(LocaleContext);
