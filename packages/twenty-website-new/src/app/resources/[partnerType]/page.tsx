import { FusePageShell } from '@/app/_components/FusePageShell';
import { theme } from '@/theme';
import { styled } from '@linaria/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const PhaseGrid = styled.div`
  display: grid;
  gap: ${theme.spacing(4)};

  @media (min-width: ${theme.breakpoints.md}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Phase = styled.article`
  background: ${theme.colors.primary.background[100]};
  border: 1px solid ${theme.colors.primary.border[10]};
  border-radius: ${theme.radius(4)};
  display: grid;
  gap: ${theme.spacing(3)};
  padding: ${theme.spacing(6)};
`;

const PhaseLabel = styled.span`
  color: ${theme.colors.highlight[100]};
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(3)};
  font-weight: ${theme.font.weight.medium};
  text-transform: uppercase;
`;

const PhaseTitle = styled.h2`
  font-size: ${theme.font.size(7)};
  font-weight: ${theme.font.weight.light};
  line-height: 1;
`;

const PhaseCopy = styled.p`
  color: ${theme.colors.primary.text[80]};
  font-size: ${theme.font.size(4)};
  line-height: 1.5;
`;

const partnerPages = {
  'technology-partners': {
    title: 'Technology partners',
    body: 'Find the partners whose integrations, accounts, and ecosystem motion make them worth building with.',
  },
  'marketplace-partners': {
    title: 'Marketplace partners',
    body: 'Turn a broad ecosystem into a prioritized list of partners that can actually move distribution.',
  },
  'agency-partners': {
    title: 'Agency partners',
    body: 'Understand which agencies have the services, customers, and timing to become useful partners.',
  },
  'creator-partners': {
    title: 'Creator partners',
    body: 'Separate audience fit from vanity reach and engage the people whose context matches your market.',
  },
};

const phases = [
  {
    title: 'Recruit',
    copy: 'Build a partner universe from a thesis, company, person, or market signal.',
  },
  {
    title: 'Engage',
    copy: 'Use evidence to explain why this partner, why now, and why they should care.',
  },
  {
    title: 'Enable',
    copy: 'Keep the notes, assets, owners, and next steps connected to the partner record.',
  },
  {
    title: 'Win',
    copy: 'Learn from the partners that convert and turn that signal back into better scoring.',
  },
];

type PartnerTypePageProps = {
  params: Promise<{ partnerType: string }>;
};

export function generateStaticParams() {
  return Object.keys(partnerPages).map((partnerType) => ({ partnerType }));
}

export async function generateMetadata({
  params,
}: PartnerTypePageProps): Promise<Metadata> {
  const { partnerType } = await params;
  const page = partnerPages[partnerType as keyof typeof partnerPages];

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | Fuse`,
    description: page.body,
  };
}

export default async function PartnerTypePage({ params }: PartnerTypePageProps) {
  const { partnerType } = await params;
  const page = partnerPages[partnerType as keyof typeof partnerPages];

  if (!page) {
    notFound();
  }

  return (
    <FusePageShell eyebrow="Partner type" title={page.title} body={page.body}>
      <PhaseGrid>
        {phases.map((phase, index) => (
          <Phase key={phase.title}>
            <PhaseLabel>0{index + 1}</PhaseLabel>
            <PhaseTitle>{phase.title}</PhaseTitle>
            <PhaseCopy>{phase.copy}</PhaseCopy>
          </Phase>
        ))}
      </PhaseGrid>
    </FusePageShell>
  );
}
