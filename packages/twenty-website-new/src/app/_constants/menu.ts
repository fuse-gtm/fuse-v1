import type {
  MenuDataType,
  MenuNavItemType,
  MenuSocialLinkType,
} from '@/sections/Menu/types';

function buildNavItems(): MenuNavItemType[] {
  return [
    { label: 'Product', href: '/product' },
    { label: 'The Future', href: '/the-future' },
    {
      label: 'Partner Types',
      children: [
        {
          label: 'Technology partners',
          description: 'Recruit, engage, enable, and win with channel teams',
          href: '/resources/technology-partners',
          icon: 'code',
          preview: {
            image: '/images/product/feature/contacts.webp',
            imageAlt: 'Partner discovery workspace',
            title: 'Find the accounts worth building with',
            description:
              'Score fit by ecosystem overlap, audience, motion, and evidence before you ask for time.',
          },
        },
        {
          label: 'Marketplace partners',
          description: 'Prioritize the partners that expand distribution',
          href: '/resources/marketplace-partners',
          icon: 'tag',
          preview: {
            image: '/images/product/feature/views.webp',
            imageAlt: 'Partner scoring table',
            title: 'Turn partner lists into a ranked system',
            description:
              'Fuse keeps the context, fit drivers, and next actions in one operating loop.',
          },
        },
        {
          label: 'Agency partners',
          description: 'Map services, accounts, and co-sell paths',
          href: '/resources/agency-partners',
          icon: 'users',
          preview: {
            image: '/images/partner/hero/hero.webp',
            imageAlt: 'Partner ecosystem workspace',
            imagePosition: 'center',
            title: 'See why a partner should care',
            description:
              'Move from a name in a database to the reason they are worth engaging.',
          },
        },
        {
          label: 'Creator partners',
          description: 'Find people with the right audience and timing',
          href: '/resources/creator-partners',
          icon: 'tag',
          preview: {
            image: '/images/home/feature-cards/rag.webp',
            imageAlt: 'Partner evidence trail',
            title: 'Use evidence, not vanity metrics',
            description:
              'Fuse helps teams explain why each creator or affiliate belongs in the pipeline.',
          },
        },
      ],
    },
    { label: 'Resources', href: '/resources' },
    { label: 'Pricing', href: '/pricing' },
  ];
}

const SOCIAL_LINKS: MenuSocialLinkType[] = [];

export const MENU_DATA: MenuDataType = {
  get navItems() {
    return buildNavItems();
  },
  socialLinks: SOCIAL_LINKS,
};
