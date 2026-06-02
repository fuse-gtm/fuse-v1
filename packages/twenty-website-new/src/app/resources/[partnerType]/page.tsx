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
    body: 'Find the partners whose product fit, accounts, and ecosystem motion make them worth building with.',
    phases: [
      {
        title: 'Recruit',
        copy: 'Start with categories, adjacent products, shared accounts, and technical fit signals. Fuse ranks the companies that already have a reason to build with you.',
      },
      {
        title: 'Engage',
        copy: 'Use the evidence trail to explain why the product or channel motion is worth a conversation now.',
      },
      {
        title: 'Enable',
        copy: 'Keep use cases, joint accounts, launch notes, owners, and partner assets connected to the partner record.',
      },
      {
        title: 'Win',
        copy: 'Track which partners create pipeline and feed that back into future scoring.',
      },
    ],
  },
  'marketplace-partners': {
    title: 'Marketplace partners',
    body: 'Turn a broad ecosystem into a prioritized list of partners that can actually move distribution.',
    phases: [
      {
        title: 'Recruit',
        copy: 'Find partners with relevant listings, category momentum, and evidence they can send qualified buyers instead of passive traffic.',
      },
      {
        title: 'Engage',
        copy: 'Lead with a distribution thesis: the buyer segment, marketplace gap, and the reason this partner can help close it.',
      },
      {
        title: 'Enable',
        copy: 'Tie listings, co-marketing notes, enablement material, and marketplace plays to one operating view.',
      },
      {
        title: 'Win',
        copy: 'Separate shelfware from productive distribution by tracking partner-sourced motion and conversion signal.',
      },
    ],
  },
  'agency-partners': {
    title: 'Agency partners',
    body: 'Understand which agencies have the services, accounts, and timing to become useful partners.',
    phases: [
      {
        title: 'Recruit',
        copy: 'Score agencies by service line, buyer access, recent client work, and whether they already solve the surrounding problem.',
      },
      {
        title: 'Engage',
        copy: 'Show the agency where Fuse fits into their existing client work, not a generic reseller pitch.',
      },
      {
        title: 'Enable',
        copy: 'Track plays, account lists, notes, owner handoffs, and the assets an agency needs to sell credibly.',
      },
      {
        title: 'Win',
        copy: 'Learn which agencies produce qualified intros and use that evidence to sharpen the next recruit list.',
      },
    ],
  },
  'creator-partners': {
    title: 'Creator partners',
    body: 'Separate audience fit from vanity reach and engage the people whose context matches your market.',
    phases: [
      {
        title: 'Recruit',
        copy: 'Find people with the right audience context, problem density, trust, and recent conversation around the category.',
      },
      {
        title: 'Engage',
        copy: 'Give the creator a specific angle, audience reason, and offer instead of a generic affiliate ask.',
      },
      {
        title: 'Enable',
        copy: 'Keep briefs, examples, links, claims, and approval notes close to the relationship.',
      },
      {
        title: 'Win',
        copy: 'Measure which creators produce useful conversations and turn that signal into better future scoring.',
      },
    ],
  },
};

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
        {page.phases.map((phase, index) => (
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
