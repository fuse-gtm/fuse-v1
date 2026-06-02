import { MENU_DATA } from '@/app/_constants';
import { TalkToUsButton } from '@/app/components/ContactCalModal';
import { LinkButton } from '@/design-system/components';
import { FUSE_SIGN_UP_URL } from '@/lib/fuse-destinations';
import { Menu } from '@/sections/Menu/components';
import { theme } from '@/theme';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fuse | Find the partners worth engaging',
  description:
    'Fuse helps partner-led teams discover, score, and engage high-quality partners faster.',
};

const HOME_BACKGROUND_COLOR = '#F5F1EA';
const STAGE_BACKGROUND_COLOR = '#FBFAF6';
const ACCENT_COLOR = theme.colors.highlight[100];

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
  font-size: clamp(3.25rem, 9vw, 7.5rem);
  font-weight: ${theme.font.weight.light};
  letter-spacing: 0;
  line-height: 0.92;
  max-width: 980px;
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

const SearchStage = styled.div`
  background: ${STAGE_BACKGROUND_COLOR};
  border: 1px solid ${theme.colors.primary.border[10]};
  border-radius: ${theme.radius(5)};
  box-shadow:
    0 24px 80px rgba(28, 28, 28, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  display: grid;
  gap: ${theme.spacing(6)};
  margin: 0 auto;
  max-width: 1080px;
  overflow: hidden;
  padding: ${theme.spacing(4)};
  width: 100%;

  @media (min-width: ${theme.breakpoints.md}px) {
    padding: ${theme.spacing(7)};
  }
`;

const PromptBar = styled.div`
  background: ${theme.colors.primary.background[100]};
  border: 1px solid ${theme.colors.primary.border[10]};
  border-radius: ${theme.radius(3)};
  display: grid;
  gap: ${theme.spacing(3)};
  padding: ${theme.spacing(3)};

  @media (min-width: ${theme.breakpoints.md}px) {
    align-items: center;
    grid-template-columns: auto minmax(0, 1fr) auto;
  }
`;

const Segment = styled.div`
  align-items: center;
  background: ${theme.colors.primary.text[5]};
  border-radius: ${theme.radius(2)};
  display: inline-grid;
  grid-auto-flow: column;
  justify-content: start;
  padding: ${theme.spacing(1)};
`;

const SegmentButton = styled.span`
  border-radius: ${theme.radius(1.5)};
  color: ${theme.colors.primary.text[60]};
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(3)};
  font-weight: ${theme.font.weight.medium};
  padding: ${theme.spacing(2)} ${theme.spacing(3)};
  text-transform: uppercase;

  &[data-active='true'] {
    background: ${theme.colors.primary.background[100]};
    color: ${ACCENT_COLOR};
  }
`;

const PromptText = styled.div`
  color: ${theme.colors.primary.text[100]};
  font-family: ${theme.font.family.sans};
  font-size: clamp(1.125rem, 2vw, 1.75rem);
  font-weight: ${theme.font.weight.light};
  line-height: 1.2;
  min-width: 0;
`;

const PromptAction = styled.div`
  border: 1px solid ${theme.colors.primary.border[20]};
  border-radius: ${theme.radius(2)};
  color: ${theme.colors.primary.text[80]};
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(3)};
  font-weight: ${theme.font.weight.medium};
  justify-self: start;
  padding: ${theme.spacing(2)} ${theme.spacing(3)};
  text-transform: uppercase;

  @media (min-width: ${theme.breakpoints.md}px) {
    justify-self: end;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  gap: ${theme.spacing(4)};

  @media (min-width: ${theme.breakpoints.lg}px) {
    grid-template-columns: minmax(0, 1.45fr) minmax(260px, 0.55fr);
  }
`;

const ResultsTable = styled.div`
  border: 1px solid ${theme.colors.primary.border[10]};
  border-radius: ${theme.radius(3)};
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: ${theme.colors.primary.text[5]};
  color: ${theme.colors.primary.text[60]};
  display: none;
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(2.75)};
  font-weight: ${theme.font.weight.medium};
  grid-template-columns: 1.1fr 0.4fr 1.2fr 1fr;
  line-height: ${theme.lineHeight(3)};
  padding: ${theme.spacing(3)} ${theme.spacing(4)};
  text-transform: uppercase;

  @media (min-width: ${theme.breakpoints.md}px) {
    display: grid;
  }
`;

const ResultRow = styled.div`
  background: ${theme.colors.primary.background[100]};
  border-top: 1px solid ${theme.colors.primary.border[10]};
  display: grid;
  gap: ${theme.spacing(3)};
  padding: ${theme.spacing(4)};

  &:first-of-type {
    border-top: none;
  }

  @media (min-width: ${theme.breakpoints.md}px) {
    align-items: center;
    grid-template-columns: 1.1fr 0.4fr 1.2fr 1fr;
  }
`;

const PartnerCell = styled.div`
  display: grid;
  gap: ${theme.spacing(1)};
`;

const PartnerName = styled.span`
  font-family: ${theme.font.family.sans};
  font-size: ${theme.font.size(4)};
  font-weight: ${theme.font.weight.medium};
`;

const PartnerMeta = styled.span`
  color: ${theme.colors.primary.text[60]};
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(2.75)};
  text-transform: uppercase;
`;

const FitPill = styled.span`
  background: ${theme.colors.highlight[70]};
  border-radius: ${theme.radius(1.5)};
  color: ${theme.colors.primary.text[100]};
  display: inline-flex;
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(3)};
  font-weight: ${theme.font.weight.medium};
  justify-content: center;
  padding: ${theme.spacing(2)} ${theme.spacing(2.5)};
  width: fit-content;
`;

const RowText = styled.p`
  color: ${theme.colors.primary.text[80]};
  font-size: ${theme.font.size(3.5)};
  line-height: 1.45;
`;

const EvidencePanel = styled.aside`
  background: ${theme.colors.secondary.background[100]};
  border-radius: ${theme.radius(3)};
  color: ${theme.colors.secondary.text[100]};
  display: grid;
  gap: ${theme.spacing(5)};
  padding: ${theme.spacing(5)};
`;

const EvidenceTitle = styled.h2`
  font-family: ${theme.font.family.sans};
  font-size: ${theme.font.size(6)};
  font-weight: ${theme.font.weight.light};
  line-height: 1.05;
`;

const EvidenceList = styled.div`
  display: grid;
  gap: ${theme.spacing(3)};
`;

const EvidenceItem = styled.div`
  border-top: 1px solid ${theme.colors.secondary.border[20]};
  display: grid;
  gap: ${theme.spacing(1)};
  padding-top: ${theme.spacing(3)};
`;

const EvidenceLabel = styled.span`
  color: ${theme.colors.secondary.text[60]};
  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size(2.75)};
  text-transform: uppercase;
`;

const EvidenceCopy = styled.span`
  color: ${theme.colors.secondary.text[80]};
  font-size: ${theme.font.size(3.5)};
  line-height: 1.45;
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

const searchRows = [
  {
    name: 'Northstar Cloud',
    meta: 'B2B SaaS · Marketplace',
    fit: '92',
    why: 'Shares 147 target accounts and launches partner content every month.',
    next: 'Ask for co-sell pilot',
  },
  {
    name: 'Fieldstack Labs',
    meta: 'Agency · RevOps',
    fit: '88',
    why: 'Works with the exact segment your top customers come from.',
    next: 'Map services overlap',
  },
  {
    name: 'Mira Collective',
    meta: 'Creator · Operators',
    fit: '81',
    why: 'Audience is small, specific, and already talking about the problem.',
    next: 'Draft warm intro',
  },
];

const evidenceItems = [
  {
    label: 'Fit drivers',
    copy: 'Audience overlap, customer segment, existing GTM motion, and recent signal.',
  },
  {
    label: 'Evidence trail',
    copy: 'Every recommendation carries the pages, people, and notes that made it score.',
  },
  {
    label: 'Engagement',
    copy: 'Fuse turns a ranked partner into the next useful action, not another row in a CRM.',
  },
];

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
  'Technology and channel partners',
  'Marketplace partners',
  'Agency and solutions partners',
  'Creator and affiliate partners',
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
      'The score is tied to evidence: audience, ecosystem overlap, customer fit, timing, and the reason a partner should respond.',
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

        <SearchStage aria-label="Cached Fuse partner search demo">
          <PromptBar>
            <Segment aria-label="Search mode">
              <SegmentButton data-active="true">Company</SegmentButton>
              <SegmentButton data-active="false">Person</SegmentButton>
            </Segment>
            <PromptText>
              Find software agencies already helping Series B infrastructure
              companies expand into partner-led pipeline.
            </PromptText>
            <PromptAction>Search partners</PromptAction>
          </PromptBar>

          <ResultsGrid>
            <ResultsTable>
              <TableHeader>
                <span>Partner</span>
                <span>Fit</span>
                <span>Why this partner</span>
                <span>Next move</span>
              </TableHeader>
              {searchRows.map((row) => (
                <ResultRow key={row.name}>
                  <PartnerCell>
                    <PartnerName>{row.name}</PartnerName>
                    <PartnerMeta>{row.meta}</PartnerMeta>
                  </PartnerCell>
                  <FitPill>{row.fit}</FitPill>
                  <RowText>{row.why}</RowText>
                  <RowText>{row.next}</RowText>
                </ResultRow>
              ))}
            </ResultsTable>

            <EvidencePanel>
              <EvidenceTitle>Why Fuse picked them</EvidenceTitle>
              <EvidenceList>
                {evidenceItems.map((item) => (
                  <EvidenceItem key={item.label}>
                    <EvidenceLabel>{item.label}</EvidenceLabel>
                    <EvidenceCopy>{item.copy}</EvidenceCopy>
                  </EvidenceItem>
                ))}
              </EvidenceList>
            </EvidencePanel>
          </ResultsGrid>
        </SearchStage>
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
            <ImpactCard key={partnerType}>
              <CardKicker>Recruit · Engage · Enable · Win</CardKicker>
              <CardTitle>{partnerType}</CardTitle>
              <CardCopy>
                Fuse adapts the same discovery, scoring, and engagement loop to
                the details of this partner motion.
              </CardCopy>
            </ImpactCard>
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
