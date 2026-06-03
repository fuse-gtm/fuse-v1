import type { HomeStepperDataType } from '@/sections/HomeStepper/types';

export const HOME_STEPPER_DATA: HomeStepperDataType = {
  steps: [
    {
      heading: [
        { text: 'Discover high-fit ', fontFamily: 'serif' },
        { text: 'companies and people', fontFamily: 'sans' },
      ],
      body: {
        text: 'Search by company or person and build a focused partner universe from real market, audience, and ecosystem signals.',
      },
    },
    {
      heading: [
        { text: 'Score fit with ', fontFamily: 'serif' },
        { text: 'evidence', fontFamily: 'sans' },
      ],
      body: {
        text: 'Turn scattered signals into explainable fit: why this partner, why now, what evidence supports it, and what could change.',
      },
    },
    {
      heading: [
        { text: 'Engage with the ', fontFamily: 'serif' },
        { text: 'next move', fontFamily: 'sans' },
      ],
      body: {
        text: 'Move from a scored result to the practical action: intro path, pilot ask, co-marketing angle, or research note.',
      },
    },
  ],
};
