import * as RadixColors from '@radix-ui/colors';
import { THEME_LIGHT } from 'twenty-ui/theme';
import { type ThemeType } from 'twenty-ui/theme-constants';

const FUSE_SIGNAL_THEME: ThemeType = {
  ...THEME_LIGHT,
  accent: {
    ...THEME_LIGHT.accent,
    primary: RadixColors.cyanP3.cyan5,
    secondary: RadixColors.cyanP3.cyan5,
    tertiary: RadixColors.cyanP3.cyan3,
    quaternary: RadixColors.cyanP3.cyan2,
    accent3570: RadixColors.cyanP3.cyan8,
    accent4060: RadixColors.cyanP3.cyan8,
    accent1: RadixColors.cyanP3.cyan1,
    accent2: RadixColors.cyanP3.cyan2,
    accent3: RadixColors.cyanP3.cyan3,
    accent4: RadixColors.cyanP3.cyan4,
    accent5: RadixColors.cyanP3.cyan5,
    accent6: RadixColors.cyanP3.cyan6,
    accent7: RadixColors.cyanP3.cyan7,
    accent8: RadixColors.cyanP3.cyan8,
    accent9: RadixColors.cyanP3.cyan9,
    accent10: RadixColors.cyanP3.cyan10,
    accent11: RadixColors.cyanP3.cyan11,
    accent12: RadixColors.cyanP3.cyan12,
  },
  background: {
    ...THEME_LIGHT.background,
    secondary: RadixColors.slateP3.slate2,
    tertiary: RadixColors.slateP3.slate3,
  },
  border: {
    ...THEME_LIGHT.border,
    radius: {
      ...THEME_LIGHT.border.radius,
      sm: '6px',
      md: '10px',
      xl: '24px',
    },
  },
};

const FUSE_MOMENTUM_THEME: ThemeType = {
  ...THEME_LIGHT,
  accent: {
    ...THEME_LIGHT.accent,
    primary: RadixColors.orangeP3.orange5,
    secondary: RadixColors.orangeP3.orange5,
    tertiary: RadixColors.orangeP3.orange3,
    quaternary: RadixColors.orangeP3.orange2,
    accent3570: RadixColors.orangeP3.orange8,
    accent4060: RadixColors.orangeP3.orange8,
    accent1: RadixColors.orangeP3.orange1,
    accent2: RadixColors.orangeP3.orange2,
    accent3: RadixColors.orangeP3.orange3,
    accent4: RadixColors.orangeP3.orange4,
    accent5: RadixColors.orangeP3.orange5,
    accent6: RadixColors.orangeP3.orange6,
    accent7: RadixColors.orangeP3.orange7,
    accent8: RadixColors.orangeP3.orange8,
    accent9: RadixColors.orangeP3.orange9,
    accent10: RadixColors.orangeP3.orange10,
    accent11: RadixColors.orangeP3.orange11,
    accent12: RadixColors.orangeP3.orange12,
  },
  background: {
    ...THEME_LIGHT.background,
    secondary: RadixColors.sandP3.sand2,
    tertiary: RadixColors.sandP3.sand3,
  },
  border: {
    ...THEME_LIGHT.border,
    radius: {
      ...THEME_LIGHT.border.radius,
      sm: '3px',
      md: '6px',
      xl: '16px',
    },
  },
};

export const DESIGN_OPTION_THEME = {
  'twenty-default': THEME_LIGHT,
  'fuse-signal': FUSE_SIGNAL_THEME,
  'fuse-momentum': FUSE_MOMENTUM_THEME,
} as const;

export type DesignOptionId = keyof typeof DESIGN_OPTION_THEME;

export const DEFAULT_DESIGN_OPTION_ID: DesignOptionId = 'twenty-default';

export const DESIGN_OPTION_TOOLBAR_ITEMS = [
  { value: 'twenty-default', title: 'Twenty Default' },
  { value: 'fuse-signal', title: 'Fuse Signal (Cool)' },
  { value: 'fuse-momentum', title: 'Fuse Momentum (Warm)' },
] as const;

export const getDesignOptionTheme = (
  designOptionId: string | undefined,
): ThemeType =>
  DESIGN_OPTION_THEME[
    (designOptionId as DesignOptionId) ?? DEFAULT_DESIGN_OPTION_ID
  ] ?? DESIGN_OPTION_THEME[DEFAULT_DESIGN_OPTION_ID];
