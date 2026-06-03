import type {
  HeroHomeDataType,
  HeroTablePageDefinition,
  HeroVisualType,
} from '@/sections/Hero/types';

const COMPANY_RESULTS_PAGE: HeroTablePageDefinition = {
  type: 'table',
  header: {
    title: 'Company results',
    count: 4,
    showListIcon: true,
    actions: ['Save search', 'Write next move'],
  },
  columns: [
    { id: 'company', label: 'Company', width: 190, isFirstColumn: true },
    { id: 'partnerType', label: 'Partner type', width: 150 },
    { id: 'fit', label: 'Fit', width: 80, align: 'right' },
    { id: 'evidence', label: 'Evidence', width: 340 },
    { id: 'nextMove', label: 'Next move', width: 170 },
  ],
  rows: [
    {
      id: 'northstar-cloud',
      cells: {
        company: { type: 'entity', name: 'Northstar Cloud', domain: 'northstar.com' },
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
        company: { type: 'entity', name: 'Brightlayer', domain: 'brightlayer.com' },
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
        company: { type: 'entity', name: 'RevBridge', domain: 'revbridge.com' },
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
};

const PERSON_RESULTS_PAGE: HeroTablePageDefinition = {
  type: 'table',
  header: {
    title: 'Person results',
    count: 4,
    showListIcon: true,
    actions: ['Save search', 'Draft outreach'],
  },
  columns: [
    { id: 'person', label: 'Person', width: 190, isFirstColumn: true },
    { id: 'role', label: 'Role', width: 170 },
    { id: 'fit', label: 'Fit', width: 80, align: 'right' },
    { id: 'evidence', label: 'Evidence', width: 320 },
    { id: 'nextMove', label: 'Next move', width: 170 },
  ],
  rows: [
    {
      id: 'mira-kapoor',
      cells: {
        person: {
          type: 'person',
          name: 'Mira Kapoor',
          shortLabel: 'M',
          tone: 'green',
        },
        role: { type: 'tag', value: 'Agency operator' },
        fit: { type: 'number', value: '88' },
        evidence: {
          type: 'text',
          value: 'Runs a partner-heavy Shopify agency and writes about ecosystem gaps.',
        },
        nextMove: { type: 'text', value: 'Send pilot ask' },
      },
    },
    {
      id: 'leo-martin',
      cells: {
        person: {
          type: 'person',
          name: 'Leo Martin',
          shortLabel: 'L',
          tone: 'pink',
        },
        role: { type: 'tag', value: 'Creator' },
        fit: { type: 'number', value: '81' },
        evidence: {
          type: 'text',
          value: 'Small audience, high problem density, trusted operator context.',
        },
        nextMove: { type: 'text', value: 'Draft brief' },
      },
    },
    {
      id: 'nora-sato',
      cells: {
        person: {
          type: 'person',
          name: 'Nora Sato',
          shortLabel: 'N',
          tone: 'purple',
        },
        role: { type: 'tag', value: 'Channel lead' },
        fit: { type: 'number', value: '79' },
        evidence: {
          type: 'text',
          value: 'Recent posts show a clear thesis around partner-led pipeline.',
        },
        nextMove: { type: 'text', value: 'Find intro path' },
      },
    },
    {
      id: 'eli-rivera',
      cells: {
        person: {
          type: 'person',
          name: 'Eli Rivera',
          shortLabel: 'E',
          tone: 'amber',
        },
        role: { type: 'tag', value: 'Affiliate' },
        fit: { type: 'number', value: '76' },
        evidence: {
          type: 'text',
          value: 'Audience talks about the exact workflow gap Fuse solves.',
        },
        nextMove: { type: 'text', value: 'Write angle' },
      },
    },
  ],
};

const HERO_VISUAL: HeroVisualType = {
  workspace: { icon: 'fuse', name: 'Fuse partner search' },
  tableWidth: 1180,
  actions: ['Filter', 'Score', 'Engage'],
  workspaceNav: [
    {
      id: 'company-results',
      label: 'Company results',
      icon: { kind: 'tabler', name: 'buildingSkyscraper', tone: 'blue' },
      active: true,
      page: COMPANY_RESULTS_PAGE,
    },
    {
      id: 'person-results',
      label: 'Person results',
      icon: { kind: 'tabler', name: 'user', tone: 'teal' },
      page: PERSON_RESULTS_PAGE,
    },
    {
      id: 'evidence',
      label: 'Evidence',
      icon: { kind: 'tabler', name: 'notes', tone: 'gray' },
      page: {
        type: 'table',
        header: {
          title: 'Evidence',
          count: 4,
          showListIcon: true,
        },
        columns: [
          { id: 'signal', label: 'Signal', width: 200, isFirstColumn: true },
          { id: 'source', label: 'Source', width: 160 },
          { id: 'why', label: 'Why it matters', width: 420 },
        ],
        rows: [
          {
            id: 'shared-buyer',
            cells: {
              signal: { type: 'text', value: 'Shared buyer' },
              source: { type: 'tag', value: 'Market' },
              why: {
                type: 'text',
                value: 'The partner reaches the same operator with a different reason to talk.',
              },
            },
          },
          {
            id: 'category-content',
            cells: {
              signal: { type: 'text', value: 'Category content' },
              source: { type: 'tag', value: 'Public signal' },
              why: {
                type: 'text',
                value: 'Recent writing makes the opening message specific.',
              },
            },
          },
          {
            id: 'partner-page',
            cells: {
              signal: { type: 'text', value: 'Partner page' },
              source: { type: 'tag', value: 'Website' },
              why: {
                type: 'text',
                value: 'The company already invests in ecosystem distribution.',
              },
            },
          },
          {
            id: 'intro-path',
            cells: {
              signal: { type: 'text', value: 'Intro path' },
              source: { type: 'tag', value: 'Network' },
              why: {
                type: 'text',
                value: 'A credible path in turns search into engagement.',
              },
            },
          },
        ],
      },
    },
  ],
};

export const HERO_DATA: HeroHomeDataType = {
  heading: [
    { text: 'Find the partners worth ', fontFamily: 'serif' },
    { text: 'engaging', fontFamily: 'sans' },
  ],
  body: {
    text: 'Fuse helps partner teams discover companies and people, score fit with evidence, and turn search into the next move.',
  },
  visual: HERO_VISUAL,
};
