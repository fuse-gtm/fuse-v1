import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import {
  createAgencyReferralEventPlan,
  mergeAgencyReferralRollupDelta,
  type AgencyReferralEventInput,
  type AgencyReferralIdempotencyContext,
} from 'src/lifecycle/agency-referral-attribution';
import { ATTRIBUTION_LOGIC_FUNCTION_IDS } from 'src/constants/universal-identifiers';

type IngestAgencyReferralEventPayload = AgencyReferralEventInput & {
  idempotency?: AgencyReferralIdempotencyContext;
};

const handler = async (
  event: RoutePayload<IngestAgencyReferralEventPayload>,
) => {
  const secret = process.env.AGENCY_EVENT_SIGNING_SECRET ?? '';
  const { idempotency, ...eventInput } = event.body ?? {};
  const plan = createAgencyReferralEventPlan(
    eventInput,
    secret,
    idempotency,
  );
  const client = new CoreApiClient() as any;

  if (!plan.accepted) {
    return {
      status: 'DUPLICATE',
      duplicateReason: plan.duplicateReason,
      eventId: plan.eventData.eventId,
    };
  }

  const { createAgencyReferralEvent } = await client.mutation({
    createAgencyReferralEvent: {
      __args: { data: plan.eventData },
      id: true,
    },
  } as any);

  const { createAgencyAttribution } = await client.mutation({
    createAgencyAttribution: {
      __args: { data: plan.attributionData },
      id: true,
    },
  } as any);

  const agencyReferralEventId = createAgencyReferralEvent?.id;
  const agencyAttributionId = createAgencyAttribution?.id;

  if (agencyReferralEventId && agencyAttributionId) {
    await client.mutation({
      updateAgencyReferralEvent: {
        __args: {
          id: agencyReferralEventId,
          data: { agencyAttributionId },
        },
        id: true,
      },
    } as any);
  }

  const { agencyReferralRollups } = await client.query({
    agencyReferralRollups: {
      __args: {
        filter: { scopeId: { eq: plan.eventData.enrollmentId } },
        first: 1,
      },
      edges: {
        node: {
          id: true,
          leadCount: true,
          saleCount: true,
          revenueCents: true,
        },
      },
    },
  } as any);

  const existingRollup = agencyReferralRollups?.edges?.[0]?.node;
  const rollupCounters = mergeAgencyReferralRollupDelta(
    existingRollup,
    plan.rollupDelta,
  );
  const rollupData = {
    name: `enrollment:${plan.eventData.enrollmentId}`,
    scopeType: 'ENROLLMENT',
    scopeId: plan.eventData.enrollmentId,
    ...rollupCounters,
    lastEventAt: plan.eventData.occurredAt,
    repairStatus: 'FRESH',
    partnerProfileId: plan.eventData.partnerProfileId,
    agencyGroupId: plan.eventData.agencyGroupId,
  };

  const rollupMutationResult = existingRollup?.id
    ? await client.mutation({
        updateAgencyReferralRollup: {
          __args: {
            id: existingRollup.id,
            data: rollupData,
          },
          id: true,
        },
      } as any)
    : await client.mutation({
        createAgencyReferralRollup: {
          __args: {
            data: rollupData,
          },
          id: true,
        },
      } as any);

  const agencyReferralRollupId =
    rollupMutationResult.updateAgencyReferralRollup?.id ??
    rollupMutationResult.createAgencyReferralRollup?.id;

  return {
    status: 'accepted',
    eventId: plan.eventData.eventId,
    agencyReferralEventId,
    agencyAttributionId,
    agencyReferralRollupId,
    rollupDelta: plan.rollupDelta,
    rollupTotals: rollupCounters,
  };
};

export default defineLogicFunction({
  universalIdentifier: ATTRIBUTION_LOGIC_FUNCTION_IDS.ingestReferralEvent,
  name: 'ingest-agency-referral-event',
  description:
    'Accepts signed agency lead and sale events, dedupes retries, creates attribution, and writes rollup deltas.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: '/agency/referrals/events',
    httpMethod: 'POST',
    isAuthRequired: false,
  },
});
