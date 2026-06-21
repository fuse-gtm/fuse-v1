export const SOURCE_LOCALE = 'en' as const;

export const APP_LOCALES = {
  en: 'en',
  'fr-FR': 'fr-FR',
  'es-ES': 'es-ES',
} as const;

export type AppLocale = (typeof APP_LOCALES)[keyof typeof APP_LOCALES];
