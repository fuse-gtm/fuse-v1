import type { ThreeCardsFeatureCardsDataType } from '@/sections/ThreeCards/types';

export const THREE_CARDS_FEATURE_DATA: ThreeCardsFeatureCardsDataType = {
  eyebrow: {
    heading: {
      text: 'Works across partner motions',
      fontFamily: 'sans',
    },
  },
  heading: [
    { text: 'The same loop for ', fontFamily: 'serif' },
    { text: 'different ecosystems', fontFamily: 'sans' },
  ],
  featureCards: [
    {
      heading: { text: 'Technology and channel partners', fontFamily: 'sans' },
      body: {
        text: 'Map technical fit, account overlap, and the route to a useful joint motion.',
      },
      backgroundImageSrc:
        '/images/home/three-cards-feature/familiar-interface-gradient.webp',
      icon: 'users-group',
      illustration: 'familiar-interface',
    },
    {
      heading: { text: 'Marketplace and agency partners', fontFamily: 'sans' },
      body: {
        text: 'Prioritize partners by buyer fit, services, distribution path, and timing.',
      },
      backgroundImageSrc:
        '/images/home/three-cards-feature/live-data-gradient.webp',
      icon: 'live-data',
      illustration: 'live-data',
    },
    {
      heading: { text: 'Creator and affiliate partners', fontFamily: 'sans' },
      body: {
        text: 'Score people by audience context and trust, not vanity reach.',
      },
      backgroundImageSrc:
        '/images/home/three-cards-feature/fast-path-gradient.webp',
      icon: 'fast-path',
      illustration: 'fast-path',
    },
  ],
};
