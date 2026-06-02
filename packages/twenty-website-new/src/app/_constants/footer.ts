import type { FooterDataType } from '@/sections/Footer/types';

export const FOOTER_DATA: FooterDataType = {
  illustration: 'footerBackground',
  bottom: {
    copyright: '© 2026 – Fuse',
  },
  navGroups: [
    {
      id: 'footer-sitemap',
      title: 'Sitemap',
      ctas: [],
      links: [
        { label: 'Home', href: '/', external: false },
        { label: 'Product', href: '/product', external: false },
        { label: 'The Future', href: '/the-future', external: false },
        { label: 'Resources', href: '/resources', external: false },
        { label: 'Pricing', href: '/pricing', external: false },
      ],
    },
    {
      id: 'footer-partner-types',
      title: 'Partner Types',
      ctas: [],
      links: [
        { label: 'Technology partners', href: '/resources/technology-partners', external: false },
        { label: 'Marketplace partners', href: '/resources/marketplace-partners', external: false },
        { label: 'Agency partners', href: '/resources/agency-partners', external: false },
        { label: 'Creator partners', href: '/resources/creator-partners', external: false },
      ],
    },
    {
      id: 'footer-legal',
      title: 'Legal',
      ctas: [],
      links: [
        { label: 'Privacy', href: '/privacy', external: false },
        { label: 'Terms', href: '/terms', external: false },
      ],
    },
    {
      id: 'footer-connect',
      title: 'Connect',
      ctas: [
        {
          color: 'secondary',
          kind: 'contactModal',
          label: 'Talk to us',
          variant: 'contained',
        },
        {
          color: 'secondary',
          href: 'https://fuse-web-main-fuse-6cf22f29.vercel.app/auth/sign-up',
          kind: 'link',
          label: 'Get started',
          variant: 'outlined',
        },
      ],
      links: [],
    },
  ],
  socialLinks: [],
};
