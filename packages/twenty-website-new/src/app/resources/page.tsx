import { FusePageShell } from '@/app/_components/FusePageShell';
import { theme } from '@/theme';
import { styled } from '@linaria/react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources | Fuse',
  description:
    'Partner-type pages for applying Fuse across recruit, engage, enable, and win motions.',
};

const ResourceGrid = styled.div`
  display: grid;
  gap: ${theme.spacing(4)};

  @media (min-width: ${theme.breakpoints.md}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ResourceLink = styled(Link)`
  background: ${theme.colors.primary.background[100]};
  border: 1px solid ${theme.colors.primary.border[10]};
  border-radius: ${theme.radius(4)};
  color: ${theme.colors.primary.text[100]};
  display: grid;
  gap: ${theme.spacing(3)};
  padding: ${theme.spacing(6)};
  text-decoration: none;
`;

const ResourceTitle = styled.h2`
  font-size: ${theme.font.size(7)};
  font-weight: ${theme.font.weight.light};
  line-height: 1;
`;

const ResourceCopy = styled.p`
  color: ${theme.colors.primary.text[80]};
  font-size: ${theme.font.size(4)};
  line-height: 1.5;
`;

const resources = [
  {
    href: '/resources/technology-partners',
    title: 'Technology partners',
    copy: 'Recruit, engage, enable, and win with technology and channel partners.',
  },
  {
    href: '/resources/marketplace-partners',
    title: 'Marketplace partners',
    copy: 'Prioritize the partners that can expand distribution with clear evidence.',
  },
  {
    href: '/resources/agency-partners',
    title: 'Agency partners',
    copy: 'Map services, accounts, and co-sell paths before outreach starts.',
  },
  {
    href: '/resources/creator-partners',
    title: 'Creator partners',
    copy: 'Find people with the right audience, context, and timing.',
  },
];

export default function ResourcesPage() {
  return (
    <FusePageShell
      eyebrow="Resources"
      title="Four partner motions. One operating loop."
      body="Each partner type gets the same Fuse pattern: recruit the right partners, engage with context, enable the motion, and win with evidence."
    >
      <ResourceGrid>
        {resources.map((resource) => (
          <ResourceLink href={resource.href} key={resource.href}>
            <ResourceTitle>{resource.title}</ResourceTitle>
            <ResourceCopy>{resource.copy}</ResourceCopy>
          </ResourceLink>
        ))}
      </ResourceGrid>
    </FusePageShell>
  );
}
