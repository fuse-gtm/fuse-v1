import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import {
  repairAgencyReferralRollups,
  type AgencyReferralAcceptedEvent,
} from 'src/lifecycle/agency-referral-attribution';
import { ATTRIBUTION_LOGIC_FUNCTION_IDS } from 'src/constants/universal-identifiers';

type RepairAgencyReferralRollupsPayload = {
  events?: AgencyReferralAcceptedEvent[];
};

const handler = async (
  event: RoutePayload<RepairAgencyReferralRollupsPayload>,
) => {
  const rollups = repairAgencyReferralRollups(event.body?.events ?? []);
  const client = new CoreApiClient() as any;

  if (rollups.length > 0) {
    await client.mutation({
      createAgencyReferralRollups: {
        __args: { data: rollups as any },
        id: true,
      },
    } as any);
  }

  return {
    status: 'repaired',
    rollupCount: rollups.length,
  };
};

export default defineLogicFunction({
  universalIdentifier: ATTRIBUTION_LOGIC_FUNCTION_IDS.repairReferralRollups,
  name: 'repair-agency-referral-rollups',
  description:
    'Repairs agency referral rollups from accepted lead and sale events.',
  timeoutSeconds: 60,
  handler,
  httpRouteTriggerSettings: {
    path: '/agency/referrals/repair-rollups',
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
