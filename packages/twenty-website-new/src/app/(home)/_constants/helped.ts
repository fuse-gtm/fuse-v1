import type { HelpedDataType } from '@/sections/Helped/types/HelpedData';

export const HELPED_DATA: HelpedDataType = {
  eyebrow: {
    heading: {
      text: 'The operating loop',
      fontFamily: 'sans',
    },
  },
  heading: [
    {
      text: 'AI helps engage\nhigh-quality\n',
      fontFamily: 'serif',
    },
    {
      text: 'partners faster',
      fontFamily: 'sans',
    },
  ],
  cards: [
    {
      icon: 'none',
      heading: { text: 'Evidence beats enrichment', fontFamily: 'sans' },
      body: {
        text: 'The useful answer is not another enriched record. It is the reason a partner is worth attention.',
      },
      illustration: 'target',
      href: '/#homepage-cases',
    },
    {
      icon: 'none',
      heading: { text: 'Partner fit is contextual', fontFamily: 'sans' },
      body: {
        text: 'A strong partner in one ecosystem can be noise in another. Fuse keeps the scoring tied to the motion.',
      },
      illustration: 'spaceship',
      href: '/#homepage-cases',
    },
    {
      icon: 'none',
      heading: { text: 'Search should become a system', fontFamily: 'sans' },
      body: {
        text: 'Saved searches, evidence, scores, and next moves make repeatable partner work possible.',
      },
      illustration: 'money',
      href: '/#homepage-cases',
    },
  ],
};
