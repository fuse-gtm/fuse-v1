import type { ThreeCardsIllustrationDataType } from '@/sections/ThreeCards/types';

export const THREE_CARDS_ILLUSTRATION_DATA: ThreeCardsIllustrationDataType = {
  eyebrow: {
    heading: { text: 'What the Frankenstack causes', fontFamily: 'sans' },
  },
  heading: [
    { text: 'Less partner busywork. ', fontFamily: 'serif' },
    { text: 'Better judgment.', fontFamily: 'sans' },
  ],
  body: {
    text: 'Busywork, credibility gaps, and generic AI are consequences of running partner ecosystems on scattered passive tools.',
  },
  illustrationCards: [
    {
      heading: { text: 'Busywork', fontFamily: 'sans' },
      body: {
        text: 'Hours disappear into spreadsheets, LinkedIn tabs, notes, and half-finished partner records before real work starts.',
      },
      benefits: [
        { text: 'Manual list building', icon: 'edit' },
        { text: 'Context switching', icon: 'eye' },
        { text: 'Duplicate research', icon: 'search' },
      ],
      attribution: {
        role: { text: 'Consequence 01' },
        company: { text: 'Frankenstack' },
      },
      illustration: 'diamond',
    },
    {
      heading: { text: 'Credibility gap', fontFamily: 'sans' },
      body: {
        text: 'The partner pitch gets weaker when nobody can explain why this company, why now, or why the partner should care.',
      },
      benefits: [
        { text: 'Weak rationale', icon: 'tag' },
        { text: 'Unclear intro path', icon: 'users' },
        { text: 'Low-trust outreach', icon: 'book' },
      ],
      attribution: {
        role: { text: 'Consequence 02' },
        company: { text: 'Frankenstack' },
      },
      illustration: 'lock',
    },
    {
      heading: { text: '"Fake" AI', fontFamily: 'sans' },
      body: {
        text: 'AI bolted onto passive databases can write text, but it cannot decide who is worth engaging without partner context.',
      },
      benefits: [
        { text: 'Generic summaries', icon: 'code' },
        { text: 'No evidence trail', icon: 'eye' },
        { text: 'No next move', icon: 'check' },
      ],
      attribution: {
        role: { text: 'Consequence 03' },
        company: { text: 'Frankenstack' },
      },
      illustration: 'flash',
    },
  ],
};
