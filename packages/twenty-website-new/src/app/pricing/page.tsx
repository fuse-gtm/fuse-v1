import { FusePageShell } from '@/app/_components/FusePageShell';
import { theme } from '@/theme';
import { styled } from '@linaria/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Fuse',
  description: 'Simple early pricing for Fuse partner discovery and engagement.',
};

const PricingGrid = styled.div`
  display: grid;
  gap: ${theme.spacing(4)};

  @media (min-width: ${theme.breakpoints.lg}px) {
    grid-template-columns: 0.9fr 1.2fr 0.9fr;
  }
`;

const Tier = styled.article`
  background: ${theme.colors.primary.background[100]};
  border: 1px solid ${theme.colors.primary.border[10]};
  border-radius: ${theme.radius(4)};
  display: grid;
  gap: ${theme.spacing(4)};
  padding: ${theme.spacing(6)};

  &[data-featured='true'] {
    background: ${theme.colors.secondary.background[100]};
    color: ${theme.colors.secondary.text[100]};
  }
`;

const TierName = styled.h2`
  color: ${theme.colors.highlight[100]};
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(3)};
  font-weight: ${theme.font.weight.medium};
  text-transform: uppercase;
`;

const Price = styled.div`
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: ${theme.font.weight.light};
  line-height: 1;
`;

const Copy = styled.p`
  color: inherit;
  font-size: ${theme.font.size(4)};
  line-height: 1.55;
  opacity: 0.78;
`;

const tiers = [
  {
    name: 'Scout',
    price: 'Free',
    copy: 'Start with a small partner thesis, cached searches, and a focused list of companies worth reviewing.',
  },
  {
    name: 'Growth',
    price: '$99',
    copy: 'Run repeatable discovery, scoring, and engagement workflows for a growing partner motion.',
    featured: true,
  },
  {
    name: 'Partner OS',
    price: 'Custom',
    copy: 'For teams that need seats, workflows, deeper data, and partner intelligence across functions.',
  },
];

export default function PricingPage() {
  return (
    <FusePageShell
      eyebrow="Pricing"
      title="Simple enough to start. Serious enough to grow."
      body="V1 pricing should be easy to understand while the product matures. No fake enterprise packaging, no invented logos, and no unsupported claims before the material exists."
    >
      <PricingGrid>
        {tiers.map((tier) => (
          <Tier data-featured={tier.featured} key={tier.name}>
            <TierName>{tier.name}</TierName>
            <Price>{tier.price}</Price>
            <Copy>{tier.copy}</Copy>
          </Tier>
        ))}
      </PricingGrid>
    </FusePageShell>
  );
}
