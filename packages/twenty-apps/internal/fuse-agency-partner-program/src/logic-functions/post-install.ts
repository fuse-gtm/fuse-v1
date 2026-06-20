import { CoreApiClient } from 'twenty-client-sdk/core';
import { definePostInstallLogicFunction } from 'twenty-sdk/define';
import { POST_INSTALL_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

const seedSubmittedAt = () => new Date().toISOString();

const seedDueAt = () => {
  const dueAt = new Date();

  dueAt.setDate(dueAt.getDate() + 7);

  return dueAt.toISOString();
};

const SEED_APPLICATIONS = [
  {
    name: 'Example Agency Application',
    status: 'NEEDS_REVIEW',
    submittedAt: seedSubmittedAt(),
    website: 'https://example-agency.com',
    serviceBuckets: ['REVENUE_OPS', 'TECHNOLOGY_IMPLEMENTATION'],
    monthlyLeadVolumeBand: 'ELEVEN_TO_FIFTY',
    reviewDecisionReason: 'Seed application installed by Fuse Agency Partner Program.',
  },
];

const SEED_SERVICE_CAPABILITIES = [
  {
    name: 'Revenue Ops Implementation',
    serviceBucket: 'REVENUE_OPS',
    platformFocus: 'HUBSPOT',
    certifications: 'HubSpot Solutions Partner',
    capacityBand: 'BOUTIQUE',
  },
];

const SEED_RESOURCES = [
  {
    name: 'Agency Referral Playbook',
    resourceType: 'PLAYBOOK',
    url: 'https://fusegtm.com/docs/agency-referral-playbook',
    status: 'DRAFT',
  },
];

const SEED_GROUPS = [
  {
    name: 'Default Agency Partners',
    tier: 'STANDARD',
    status: 'ACTIVE',
  },
];

const SEED_TASKS = [
  {
    name: 'Review Example Agency Application',
    taskType: 'APPLICATION_REVIEW',
    status: 'OPEN',
    dueAt: seedDueAt(),
  },
];

const handler = async () => {
  const client = new CoreApiClient() as any;

  const { createAgencyApplications } = await client.mutation({
    createAgencyApplications: {
      __args: { data: SEED_APPLICATIONS as any },
      id: true,
    },
  } as any);

  const { createAgencyServiceCapabilities } = await client.mutation({
    createAgencyServiceCapabilities: {
      __args: { data: SEED_SERVICE_CAPABILITIES as any },
      id: true,
    },
  } as any);

  const { createAgencyResources } = await client.mutation({
    createAgencyResources: {
      __args: { data: SEED_RESOURCES as any },
      id: true,
    },
  } as any);

  const { createAgencyGroups } = await client.mutation({
    createAgencyGroups: {
      __args: { data: SEED_GROUPS as any },
      id: true,
    },
  } as any);

  const { createAgencyTasks } = await client.mutation({
    createAgencyTasks: {
      __args: { data: SEED_TASKS as any },
      id: true,
    },
  } as any);

  return {
    seededAgencyApplications: createAgencyApplications?.length ?? 0,
    seededAgencyServiceCapabilities:
      createAgencyServiceCapabilities?.length ?? 0,
    seededAgencyResources: createAgencyResources?.length ?? 0,
    seededAgencyGroups: createAgencyGroups?.length ?? 0,
    seededAgencyTasks: createAgencyTasks?.length ?? 0,
  };
};

export default definePostInstallLogicFunction({
  universalIdentifier: POST_INSTALL_UNIVERSAL_IDENTIFIER,
  name: 'seed-fuse-agency-partner-program',
  description:
    'Seeds starter agency application, service capability, resource, and task records.',
  timeoutSeconds: 30,
  handler,
  shouldRunSynchronously: true,
});
