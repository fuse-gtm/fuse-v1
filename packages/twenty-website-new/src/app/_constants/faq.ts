import type { FaqDataType } from '@/sections/Faq/types';

export const FAQ_DATA: FaqDataType = {
  illustration: 'faqBackground',
  eyebrow: {
    heading: {
      text: 'Questions',
      fontFamily: 'sans',
    },
  },
  heading: [
    {
      text: 'A practical system for\n',
      fontFamily: 'serif',
    },
    {
      text: 'partner-led growth',
      fontFamily: 'sans',
    },
  ],
  questions: [
    {
      question: {
        text: 'Is Fuse a CRM?',
        fontFamily: 'sans',
      },
      answer: {
        text: 'Fuse is built for partner-led growth. It keeps useful context organized, but the first job is finding, scoring, and engaging the right partners.',
      },
    },
    {
      question: {
        text: 'Does the landing page use live search?',
        fontFamily: 'sans',
      },
      answer: {
        text: 'No. The public demo is cached so the landing page loads quickly. Live discovery belongs inside the app experience.',
      },
    },
    {
      question: {
        text: 'What makes the scoring useful?',
        fontFamily: 'sans',
      },
      answer: {
        text: 'The score is tied to evidence: audience, ecosystem overlap, buyer fit, timing, and the reason a partner should respond.',
      },
    },
    {
      question: {
        text: 'Can Fuse search for companies and people?',
        fontFamily: 'sans',
      },
      answer: {
        text: 'Yes. The landing page demo shows the two top-level modes: Company for partner organizations and Person for operators, creators, agency leads, and channel people.',
      },
    },
    {
      question: {
        text: 'Why start with cached results?',
        fontFamily: 'sans',
      },
      answer: {
        text: 'The landing page should be fast and reliable. Cached results show the product shape without making first paint depend on a live search provider.',
      },
    },
    {
      question: {
        text: 'What happens after a partner is scored?',
        fontFamily: 'sans',
      },
      answer: {
        text: 'Fuse turns the result into the next move: an intro path, pilot ask, co-marketing angle, or research note grounded in the evidence.',
      },
    },
  ],
};
