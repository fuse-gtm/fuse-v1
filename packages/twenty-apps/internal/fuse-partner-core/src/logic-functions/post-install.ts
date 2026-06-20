import { CoreApiClient } from 'twenty-client-sdk/core';
import { definePostInstallLogicFunction } from 'twenty-sdk/define';
import { POST_INSTALL_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

const SEED_PARTNER_PROGRAMS = [
  {
    name: 'Fuse Referral Program',
    programMechanic: 'referral',
    ecosystem: 'Fuse',
    programBrandName: 'Fuse Partner Program',
    commercialModels: ['commission', 'co_marketing'],
    tier: 'Standard',
  },
];

const SEED_PARTNER_PROFILES = [
  {
    name: 'Example Agency Partner',
    primaryDomain: 'example-agency.com',
    partnerType: 'agency',
    partnerSubtypes: ['revenue_ops'],
    programMechanics: ['referral', 'services'],
    commercialModels: ['commission', 'certifications'],
    status: 'candidate',
  },
];

const handler = async () => {
  const client = new CoreApiClient() as any;

  const { createPartnerPrograms } = await client.mutation({
    createPartnerPrograms: {
      __args: { data: SEED_PARTNER_PROGRAMS as any },
      id: true,
    },
  } as any);

  const { createPartnerProfiles } = await client.mutation({
    createPartnerProfiles: {
      __args: { data: SEED_PARTNER_PROFILES as any },
      id: true,
    },
  } as any);

  const partnerProgramId = createPartnerPrograms?.[0]?.id;
  const partnerProfileId = createPartnerProfiles?.[0]?.id;

  if (partnerProgramId && partnerProfileId) {
    await client.mutation({
      createPartnerEnrollments: {
        __args: {
          data: [
            {
              name: 'Example Agency Partner - Fuse Referral Program',
              status: 'active',
              startedAt: new Date().toISOString().slice(0, 10),
              notes: 'Seed enrollment installed by Fuse Partner Core.',
              partnerProgramId,
              partnerProfileId,
            },
          ] as any,
        },
        id: true,
      },
    } as any);
  }

  return {
    seededPartnerPrograms: SEED_PARTNER_PROGRAMS.length,
    seededPartnerProfiles: SEED_PARTNER_PROFILES.length,
    seededPartnerEnrollments: partnerProgramId && partnerProfileId ? 1 : 0,
  };
};

export default definePostInstallLogicFunction({
  universalIdentifier: POST_INSTALL_UNIVERSAL_IDENTIFIER,
  name: 'seed-fuse-partner-core',
  description:
    'Seeds the baseline Fuse partner program, example partner profile, and enrollment.',
  timeoutSeconds: 30,
  handler,
  shouldRunSynchronously: true,
});
