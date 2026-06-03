import type { ProblemDataType } from '@/sections/Problem/types';

export const PROBLEM_DATA: ProblemDataType = {
  eyebrow: { heading: { text: 'The Frankenstack problem', fontFamily: 'sans' } },
  heading: [
    { text: 'Partner teams run complex ecosystems ', fontFamily: 'serif' },
    { text: 'on passive databases', fontFamily: 'sans' },
  ],
  points: [
    {
      heading: { text: 'Signals live everywhere', fontFamily: 'sans' },
      body: {
        text: 'Partner context is scattered across spreadsheets, email, LinkedIn, notes, search, and old systems of record.',
      },
    },
    {
      heading: { text: 'The record does not tell you what to do', fontFamily: 'sans' },
      body: {
        text: 'A database can store names, but it does not explain fit, evidence, timing, or the next useful move.',
      },
    },
  ],
};
