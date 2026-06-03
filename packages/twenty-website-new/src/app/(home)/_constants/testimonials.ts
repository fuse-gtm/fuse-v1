import type { TestimonialsDataType } from '@/sections/Testimonials/types';

export const TESTIMONIALS_DATA: TestimonialsDataType = {
  eyebrow: {
    heading: { text: 'Built for people who do partner work', fontFamily: 'sans' },
  },
  testimonials: [
    {
      heading: {
        text: 'The product starts from the work operators already do: finding overlap, judging fit, and deciding who deserves attention.',
        fontFamily: 'sans',
      },
      author: {
        name: { text: 'Product principle' },
        designation: { text: 'Evidence before outreach' },
      },
    },
    {
      heading: {
        text: 'Partner systems should explain why a company or person matters, not just store another row in a database.',
        fontFamily: 'sans',
      },
      author: {
        name: { text: 'Product principle' },
        designation: { text: 'Context before volume' },
      },
    },
    {
      heading: {
        text: 'The next move matters. A scored partner should become an intro path, pilot ask, co-marketing angle, or research note.',
        fontFamily: 'sans',
      },
      author: {
        name: { text: 'Product principle' },
        designation: { text: 'Action before automation' },
      },
    },
  ],
};
