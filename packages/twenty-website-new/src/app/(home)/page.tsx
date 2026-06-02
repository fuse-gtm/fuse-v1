import { MENU_DATA } from '@/app/_constants';
import { TalkToUsButton } from '@/app/components/ContactCalModal';
import { LinkButton } from '@/design-system/components';
import { FUSE_SIGN_UP_URL } from '@/lib/fuse-destinations';
import { Hero as TwentyHero } from '@/sections/Hero/components';
import type { HeroVisualType } from '@/sections/Hero/types';
import { Menu } from '@/sections/Menu/components';
import { theme } from '@/theme';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fuse | Find the partners worth engaging',
  description:
    'Fuse helps partner-led teams discover, score, and engage high-quality partners faster.',
};

const HOME_BACKGROUND_COLOR = '#F5F1EA';

const heroHeadingClassName = css`
  max-width: 980px;
`;

const Page = styled.div`
  background: ${HOME_BACKGROUND_COLOR};
  color: ${theme.colors.primary.text[100]};
`;

const Hero = styled.section`
  display: grid;
  gap: ${theme.spacing(12)};
  margin: 0 auto;
  max-width: 1280px;
  padding: ${theme.spacing(16)} ${theme.spacing(5)} ${theme.spacing(18)};

  @media (min-width: ${theme.breakpoints.md}px) {
    padding: ${theme.spacing(24)} ${theme.spacing(10)} ${theme.spacing(22)};
  }
`;

const HeroCopy = styled.div`
  align-items: center;
  display: grid;
  gap: ${theme.spacing(6)};
  justify-items: center;
  text-align: center;
`;

const Eyebrow = styled.p`
  border: 1px solid ${theme.colors.primary.border[10]};
  border-radius: ${theme.radius(2)};
  color: ${theme.colors.primary.text[60]};
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(3)};
  font-weight: ${theme.font.weight.medium};
  letter-spacing: 0;
  line-height: ${theme.lineHeight(4)};
  padding: ${theme.spacing(2)} ${theme.spacing(3)};
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  font-family: ${theme.font.family.sans};
  font-size: ${theme.font.size(12)};
  font-weight: ${theme.font.weight.light};
  letter-spacing: 0;
  line-height: ${theme.lineHeight(13.5)};
  max-width: 980px;

  @media (min-width: ${theme.breakpoints.md}px) {
    font-size: ${theme.font.size(20)};
    line-height: ${theme.lineHeight(21.5)};
  }
`;

const HeroBody = styled.p`
  color: ${theme.colors.primary.text[80]};
  font-family: ${theme.font.family.sans};
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  font-weight: ${theme.font.weight.light};
  line-height: 1.45;
  max-width: 700px;
`;

const CtaRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing(3)};
  justify-content: center;
`;

const Section = styled.section`
  display: grid;
  gap: ${theme.spacing(10)};
  margin: 0 auto;
  max-width: 1280px;
  padding: ${theme.spacing(16)} ${theme.spacing(5)};

  @media (min-width: ${theme.breakpoints.md}px) {
    padding: ${theme.spacing(22)} ${theme.spacing(10)};
  }
`;

const SectionIntro = styled.div`
  display: grid;
  gap: ${theme.spacing(4)};
  max-width: 780px;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.font.family.sans};
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  font-weight: ${theme.font.weight.light};
  letter-spacing: 0;
  line-height: 0.95;
`;

const SectionBody = styled.p`
  color: ${theme.colors.primary.text[80]};
  font-size: clamp(1.05rem, 1.5vw, 1.35rem);
  line-height: 1.55;
  max-width: 720px;
`;

const ImpactGrid = styled.div`
  display: grid;
  gap: ${theme.spacing(4)};

  @media (min-width: ${theme.breakpoints.md}px) {
    grid-template-columns: 1.15fr 0.85fr;
  }
`;

const ImpactCard = styled.article`
  background: ${theme.colors.primary.background[100]};
  border: 1px solid ${theme.colors.primary.border[10]};
  border-radius: ${theme.radius(4)};
  display: grid;
  gap: ${theme.spacing(5)};
  min-height: 260px;
  padding: ${theme.spacing(6)};

  &:first-child {
    @media (min-width: ${theme.breakpoints.md}px) {
      grid-row: span 2;
      min-height: 420px;
    }
  }
`;

const CardKicker = styled.span`
  color: ${theme.colors.highlight[100]};
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(3)};
  font-weight: ${theme.font.weight.medium};
  text-transform: uppercase;
`;

const CardTitle = styled.h3`
  font-family: ${theme.font.family.sans};
  font-size: clamp(1.7rem, 3vw, 3rem);
  font-weight: ${theme.font.weight.light};
  line-height: 1;
`;

const CardCopy = styled.p`
  color: ${theme.colors.primary.text[80]};
  font-size: ${theme.font.size(4)};
  line-height: 1.5;
  max-width: 560px;
`;

const WorkflowGrid = styled.div`
  display: grid;
  gap: ${theme.spacing(4)};

  @media (min-width: ${theme.breakpoints.lg}px) {
    grid-template-columns: 0.85fr 1.15fr;
  }
`;

const WorkflowRail = styled.div`
  align-content: start;
  display: grid;
  gap: ${theme.spacing(3)};
`;

const WorkflowStep = styled.div`
  border-top: 1px solid ${theme.colors.primary.border[20]};
  display: grid;
  gap: ${theme.spacing(2)};
  padding-top: ${theme.spacing(4)};
`;

const PartnerGrid = styled.div`
  display: grid;
  gap: ${theme.spacing(4)};

  @media (min-width: ${theme.breakpoints.md}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const PartnerCardLink = styled(Link)`
  background: ${theme.colors.primary.background[100]};
  border: 1px solid ${theme.colors.primary.border[10]};
  border-radius: ${theme.radius(4)};
  color: ${theme.colors.primary.text[100]};
  display: grid;
  gap: ${theme.spacing(5)};
  min-height: 260px;
  padding: ${theme.spacing(6)};
  text-decoration: none;
  transition:
    border-color 180ms ease,
    transform 180ms ease;

  &:is(:hover, :focus-visible) {
    border-color: ${theme.colors.primary.border[40]};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 1px solid ${theme.colors.highlight[100]};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const PricingGrid = styled.div`
  display: grid;
  gap: ${theme.spacing(4)};

  @media (min-width: ${theme.breakpoints.lg}px) {
    grid-template-columns: 0.9fr 1.2fr 0.9fr;
  }
`;

const PriceCard = styled.article`
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

const Price = styled.div`
  font-family: ${theme.font.family.sans};
  font-size: clamp(2.25rem, 4vw, 4rem);
  font-weight: ${theme.font.weight.light};
  line-height: 1;
`;

const FaqGrid = styled.div`
  display: grid;
  gap: ${theme.spacing(3)};
`;

const FaqItem = styled.article`
  border-top: 1px solid ${theme.colors.primary.border[20]};
  display: grid;
  gap: ${theme.spacing(2)};
  padding-top: ${theme.spacing(5)};
`;

const FinalCta = styled.section`
  align-items: center;
  background: ${theme.colors.secondary.background[100]};
  color: ${theme.colors.secondary.text[100]};
  display: grid;
  gap: ${theme.spacing(6)};
  justify-items: center;
  padding: ${theme.spacing(18)} ${theme.spacing(5)};
  text-align: center;
`;

const FinalTitle = styled.h2`
  font-family: ${theme.font.family.sans};
  font-size: clamp(2.75rem, 7vw, 6rem);
  font-weight: ${theme.font.weight.light};
  line-height: 0.95;
  max-width: 820px;
`;

const fuseHeroVisual: HeroVisualType = {
  workspace: { icon: 'fuse', name: 'Fuse Partner OS' },
  tableWidth: 1180,
  actions: ['Filter', 'Score', 'Engage'],
  workspaceNav: [
    {
      id: 'company-search',
      label: 'Company Search',
      icon: { kind: 'tabler', name: 'buildingSkyscraper', tone: 'blue' },
      active: true,
      page: {
        type: 'table',
        header: {
          title: 'Company Search',
          count: 4,
          showListIcon: true,
          actions: ['Save search', 'Create sequence'],
        },
        columns: [
          { id: 'company', label: 'Company', width: 190, isFirstColumn: true },
          { id: 'partnerType', label: 'Partner Type', width: 150 },
          { id: 'fit', label: 'Fit', width: 80, align: 'right' },
          { id: 'evidence', label: 'Evidence', width: 320 },
          { id: 'nextMove', label: 'Next Move', width: 170 },
        ],
        rows: [
          {
            id: 'northstar-cloud',
            cells: {
              company: {
                type: 'entity',
                name: 'Northstar Cloud',
                domain: 'northstar.com',
              },
              partnerType: { type: 'tag', value: 'Technology' },
              fit: { type: 'number', value: '92' },
              evidence: {
                type: 'text',
                value: 'Shared accounts, partner page, and recent category content.',
              },
              nextMove: { type: 'text', value: 'Map co-sell path' },
            },
          },
          {
            id: 'atlaspay',
            cells: {
              company: { type: 'entity', name: 'AtlasPay', domain: 'atlaspay.com' },
              partnerType: { type: 'tag', value: 'Marketplace' },
              fit: { type: 'number', value: '87' },
              evidence: {
                type: 'text',
                value: 'Marketplace motion overlaps with your target segment.',
              },
              nextMove: { type: 'text', value: 'Review partner stack' },
            },
          },
          {
            id: 'brightlayer',
            cells: {
              company: {
                type: 'entity',
                name: 'Brightlayer',
                domain: 'brightlayer.com',
              },
              partnerType: { type: 'tag', value: 'Channel' },
              fit: { type: 'number', value: '83' },
              evidence: {
                type: 'text',
                value: 'Community signal and partner motion point to a practical route in.',
              },
              nextMove: { type: 'text', value: 'Draft warm intro' },
            },
          },
          {
            id: 'revbridge',
            cells: {
              company: {
                type: 'entity',
                name: 'RevBridge',
                domain: 'revbridge.com',
              },
              partnerType: { type: 'tag', value: 'Agency' },
              fit: { type: 'number', value: '79' },
              evidence: {
                type: 'text',
                value: 'Serves the same buyer and packages ecosystem services.',
              },
              nextMove: { type: 'text', value: 'Send pilot ask' },
            },
          },
        ],
      },
    },
    {
      id: 'partner-search',
      label: 'Partner Search',
      icon: { kind: 'tabler', name: 'user', tone: 'teal' },
      page: {
        type: 'table',
        header: {
          title: 'Partner Search',
          count: 4,
          showListIcon: true,
          actions: ['Save search', 'Draft outreach'],
        },
        columns: [
          { id: 'partner', label: 'Partner', width: 190, isFirstColumn: true },
          { id: 'motion', label: 'Motion', width: 150 },
          { id: 'fit', label: 'Fit', width: 80, align: 'right' },
          { id: 'evidence', label: 'Evidence', width: 320 },
          { id: 'nextMove', label: 'Next Move', width: 170 },
        ],
        rows: [
          {
            id: 'fieldstack-labs',
            cells: {
              partner: {
                type: 'person',
                name: 'Fieldstack Labs',
                shortLabel: 'F',
                tone: 'green',
              },
              motion: { type: 'tag', value: 'Solutions' },
              fit: { type: 'number', value: '88' },
              evidence: {
                type: 'text',
                value: 'Serves the same buyer and already packages ecosystem work.',
              },
              nextMove: { type: 'text', value: 'Send pilot ask' },
            },
          },
          {
            id: 'mira-collective',
            cells: {
              partner: {
                type: 'person',
                name: 'Mira Collective',
                shortLabel: 'M',
                tone: 'pink',
              },
              motion: { type: 'tag', value: 'Creator' },
              fit: { type: 'number', value: '81' },
              evidence: {
                type: 'text',
                value: 'Small audience, high problem density, trusted operator context.',
              },
              nextMove: { type: 'text', value: 'Draft brief' },
            },
          },
          {
            id: 'lattice-works',
            cells: {
              partner: {
                type: 'person',
                name: 'Lattice Works',
                shortLabel: 'L',
                tone: 'purple',
              },
              motion: { type: 'tag', value: 'Channel' },
              fit: { type: 'number', value: '79' },
              evidence: {
                type: 'text',
                value: 'Recent posts show a clear thesis around partner-led pipeline.',
              },
              nextMove: { type: 'text', value: 'Find intro path' },
            },
          },
          {
            id: 'operator-field-notes',
            cells: {
              partner: {
                type: 'person',
                name: 'Operator Field Notes',
                shortLabel: 'O',
                tone: 'amber',
              },
              motion: { type: 'tag', value: 'Affiliate' },
              fit: { type: 'number', value: '76' },
              evidence: {
                type: 'text',
                value: 'Audience talks about the exact workflow gap Fuse solves.',
              },
              nextMove: { type: 'text', value: 'Write angle' },
            },
          },
        ],
      },
    },
  ],
};

const impacts = [
  {
    kicker: 'Consequence 01',
    title: 'Busywork',
    copy: 'Teams spend hours stitching together tabs, notes, LinkedIn searches, spreadsheets, and half-finished partner records before any real work starts.',
  },
  {
    kicker: 'Consequence 02',
    title: 'Credibility gap',
    copy: 'The partner pitch gets weaker when nobody can explain why this company, why now, or why the partner should care.',
  },
  {
    kicker: 'Consequence 03',
    title: '"Fake" AI',
    copy: 'AI bolted onto passive databases can write text, but it cannot decide who is worth engaging without the right partner context.',
  },
];

const workflow = [
  {
    title: 'Discover',
    copy: 'Search by company or person and build a ranked partner universe from real evidence.',
  },
  {
    title: 'Score',
    copy: 'Turn the messy signals into a clear fit score with explainable drivers.',
  },
  {
    title: 'Engage',
    copy: 'Move from a scored partner to the right next action, message, or play.',
  },
];

const partnerTypes = [
  {
    href: '/resources/technology-partners',
    title: 'Technology and channel partners',
    copy: 'Map technical fit, account overlap, and the route to a useful joint motion.',
  },
  {
    href: '/resources/marketplace-partners',
    title: 'Marketplace partners',
    copy: 'Find the partners that can turn marketplace presence into distribution, not shelfware.',
  },
  {
    href: '/resources/agency-partners',
    title: 'Agency and solutions partners',
    copy: 'Prioritize agencies by services, buyer fit, buying committee access, and timing.',
  },
  {
    href: '/resources/creator-partners',
    title: 'Creator and affiliate partners',
    copy: 'Score people by audience context and trust, not vanity reach.',
  },
];

const pricing = [
  {
    tier: 'Scout',
    price: 'Free',
    copy: 'For teams proving the partner motion with a small list and a sharp point of view.',
  },
  {
    tier: 'Growth',
    price: '$99',
    copy: 'For teams running repeatable discovery, scoring, and engagement every week.',
    featured: true,
  },
  {
    tier: 'Partner OS',
    price: 'Custom',
    copy: 'For teams that need workflows, seats, and partner intelligence across functions.',
  },
];

const faqs = [
  {
    question: 'Is Fuse a CRM?',
    answer:
      'Fuse is built for partner-led growth. It keeps the useful parts of a system of record, but the first job is finding, scoring, and engaging the right partners.',
  },
  {
    question: 'Does the homepage use live search?',
    answer:
      'No. The public demo is cached so the page loads quickly. Live discovery belongs inside the app experience.',
  },
  {
    question: 'What makes the scoring useful?',
    answer:
      'The score is tied to evidence: audience, ecosystem overlap, buyer fit, timing, and the reason a partner should respond.',
  },
];

export default function HomePage() {
  return (
    <Page>
      <Menu.Root
        backgroundColor={HOME_BACKGROUND_COLOR}
        scheme="primary"
        navItems={MENU_DATA.navItems}
        socialLinks={MENU_DATA.socialLinks}
      >
        <Menu.Logo scheme="primary" />
        <Menu.Nav scheme="primary" navItems={MENU_DATA.navItems} />
        <Menu.Social scheme="primary" socialLinks={MENU_DATA.socialLinks} />
        <Menu.Cta scheme="primary" />
      </Menu.Root>

      <Hero>
        <HeroCopy>
          <Eyebrow>Partner-led growth, without the Frankenstack</Eyebrow>
          <HeroTitle className={heroHeadingClassName}>
            Find the partners worth engaging.
          </HeroTitle>
          <HeroBody>
            Fuse helps teams discover, score, and engage high-quality partners
            faster, with AI that understands the evidence behind every match.
          </HeroBody>
          <CtaRow>
            <LinkButton
              color="secondary"
              href={FUSE_SIGN_UP_URL}
              label="Get started"
              type="anchor"
              variant="contained"
            />
            <TalkToUsButton
              color="secondary"
              label="Talk to us"
              variant="outlined"
            />
          </CtaRow>
        </HeroCopy>

        <TwentyHero.HomeVisual visual={fuseHeroVisual} />
      </Hero>

      <Section>
        <SectionIntro>
          <Eyebrow>The Frankenstack problem</Eyebrow>
          <SectionTitle>
            Complex ecosystems are running on passive databases.
          </SectionTitle>
          <SectionBody>
            Partnership teams do not fail because they lack another place to log
            accounts. They fail because the context is scattered, the work is
            manual, and the system cannot tell them who deserves attention.
          </SectionBody>
        </SectionIntro>
        <ImpactGrid>
          {impacts.map((impact) => (
            <ImpactCard key={impact.title}>
              <CardKicker>{impact.kicker}</CardKicker>
              <CardTitle>{impact.title}</CardTitle>
              <CardCopy>{impact.copy}</CardCopy>
            </ImpactCard>
          ))}
        </ImpactGrid>
      </Section>

      <Section>
        <WorkflowGrid>
          <SectionIntro>
            <Eyebrow>The Fuse workflow</Eyebrow>
            <SectionTitle>AI helps engage high-quality partners faster.</SectionTitle>
            <SectionBody>
              Fuse starts where partner work starts: with a person, company, or
              market thesis. From there it turns discovery into a scored,
              explainable partner pipeline.
            </SectionBody>
          </SectionIntro>
          <WorkflowRail>
            {workflow.map((step, index) => (
              <WorkflowStep key={step.title}>
                <CardKicker>0{index + 1}</CardKicker>
                <CardTitle>{step.title}</CardTitle>
                <CardCopy>{step.copy}</CardCopy>
              </WorkflowStep>
            ))}
          </WorkflowRail>
        </WorkflowGrid>
      </Section>

      <Section>
        <SectionIntro>
          <Eyebrow>Works across partner motions</Eyebrow>
          <SectionTitle>Different ecosystems. One operating model.</SectionTitle>
        </SectionIntro>
        <PartnerGrid>
          {partnerTypes.map((partnerType) => (
            <PartnerCardLink href={partnerType.href} key={partnerType.href}>
              <CardKicker>Recruit · Engage · Enable · Win</CardKicker>
              <CardTitle>{partnerType.title}</CardTitle>
              <CardCopy>{partnerType.copy}</CardCopy>
            </PartnerCardLink>
          ))}
        </PartnerGrid>
      </Section>

      <Section>
        <SectionIntro>
          <Eyebrow>Pricing shape</Eyebrow>
          <SectionTitle>Start simple. Grow into the operating system.</SectionTitle>
        </SectionIntro>
        <PricingGrid>
          {pricing.map((plan) => (
            <PriceCard key={plan.tier} data-featured={plan.featured}>
              <CardKicker>{plan.tier}</CardKicker>
              <Price>{plan.price}</Price>
              <CardCopy>{plan.copy}</CardCopy>
            </PriceCard>
          ))}
        </PricingGrid>
      </Section>

      <Section>
        <SectionIntro>
          <Eyebrow>FAQ</Eyebrow>
          <SectionTitle>Short answers before the first call.</SectionTitle>
        </SectionIntro>
        <FaqGrid>
          {faqs.map((item) => (
            <FaqItem key={item.question}>
              <CardTitle>{item.question}</CardTitle>
              <CardCopy>{item.answer}</CardCopy>
            </FaqItem>
          ))}
        </FaqGrid>
      </Section>

      <FinalCta>
        <FinalTitle>Stop operating partnerships from a Frankenstack.</FinalTitle>
        <CtaRow>
          <LinkButton
            color="primary"
            href={FUSE_SIGN_UP_URL}
            label="Get started"
            type="anchor"
            variant="contained"
          />
          <TalkToUsButton color="primary" label="Talk to us" variant="outlined" />
        </CtaRow>
      </FinalCta>
    </Page>
  );
}
