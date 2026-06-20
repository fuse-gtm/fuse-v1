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
    status: 'needs_review',
    submittedAt: seedSubmittedAt(),
    website: 'https://example-agency.com',
    serviceBuckets: ['revenue_ops', 'technology_implementation'],
    monthlyLeadVolumeBand: 'eleven_to_fifty',
    reviewDecisionReason: 'Seed application installed by Fuse Agency Partner Program.',
  },
];

const SEED_SERVICE_CAPABILITIES = [
  {
    name: 'Revenue Ops Implementation',
    serviceBucket: 'revenue_ops',
    platformFocus: 'hubspot',
    certifications: 'HubSpot Solutions Partner',
    capacityBand: 'boutique',
  },
];

const SEED_RESOURCES = [
  {
    name: 'Agency Referral Playbook',
    resourceType: 'playbook',
    url: 'https://fusegtm.com/docs/agency-referral-playbook',
    status: 'draft',
  },
];

const SEED_GROUPS = [
  {
    name: 'Default Agency Partners',
    tier: 'standard',
    status: 'active',
  },
];

const SEED_TASKS = [
  {
    name: 'Review Example Agency Application',
    taskType: 'application_review',
    status: 'open',
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
