import { FusePageShell } from '@/app/_components/FusePageShell';
import { theme } from '@/theme';
import { styled } from '@linaria/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product | Fuse',
  description:
    'Discover, score, and engage high-quality partners with Fuse.',
};

const ProductGrid = styled.div`
  display: grid;
  gap: ${theme.spacing(4)};

  @media (min-width: ${theme.breakpoints.lg}px) {
    grid-template-columns: 0.9fr 1.15fr 0.95fr;
  }
`;

const ProductPanel = styled.article`
  background: ${theme.colors.primary.background[100]};
  border: 1px solid ${theme.colors.primary.border[10]};
  border-radius: ${theme.radius(4)};
  display: grid;
  gap: ${theme.spacing(4)};
  min-height: 320px;
  padding: ${theme.spacing(6)};

  &:nth-child(2) {
    background: ${theme.colors.secondary.background[100]};
    color: ${theme.colors.secondary.text[100]};
  }
`;

const Kicker = styled.span`
  color: ${theme.colors.highlight[100]};
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(3)};
  font-weight: ${theme.font.weight.medium};
  text-transform: uppercase;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: ${theme.font.weight.light};
  line-height: 1;
`;

const Copy = styled.p`
  color: inherit;
  font-size: ${theme.font.size(4)};
  line-height: 1.55;
  opacity: 0.78;
`;

const productSteps = [
  {
    title: 'Discover',
    copy: 'Start from a company, person, category, or partner thesis. Fuse builds a ranked universe from real ecosystem evidence.',
  },
  {
    title: 'Score',
    copy: 'See fit drivers, timing, account overlap, and why each partner deserves attention before outreach starts.',
  },
  {
    title: 'Engage',
    copy: 'Turn the score into the next useful action: a message, intro path, co-sell play, or enablement step.',
  },
];

export default function ProductPage() {
  return (
    <FusePageShell
      eyebrow="Product"
      title="Discover, score, engage."
      body="Fuse turns partner research into a repeatable operating loop. It is not another passive database; it is the system that helps decide who is worth engaging and why."
    >
      <ProductGrid>
        {productSteps.map((step, index) => (
          <ProductPanel key={step.title}>
            <Kicker>0{index + 1}</Kicker>
            <Title>{step.title}</Title>
            <Copy>{step.copy}</Copy>
          </ProductPanel>
        ))}
      </ProductGrid>
    </FusePageShell>
  );
}
