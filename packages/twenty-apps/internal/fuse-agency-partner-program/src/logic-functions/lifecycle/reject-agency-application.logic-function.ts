import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { createAgencyRejectionPlan } from 'src/lifecycle/agency-application-lifecycle';
import { LIFECYCLE_LOGIC_FUNCTION_IDS } from 'src/constants/universal-identifiers';

const handler = async (
  event: RoutePayload<Parameters<typeof createAgencyRejectionPlan>[0]>,
) => {
  const plan = createAgencyRejectionPlan(event.body ?? {});
  const client = new CoreApiClient() as any;

  await client.mutation({
    updateAgencyApplication: {
      __args: {
        id: plan.applicationId,
        data: plan.applicationUpdateData,
      },
      id: true,
    },
  } as any);

  const { createAgencyReviewEvent } = await client.mutation({
    createAgencyReviewEvent: {
      __args: {
        data: {
          ...plan.reviewEventData,
          applicationId: plan.applicationId,
        },
      },
      id: true,
    },
  } as any);

  return {
    status: 'rejected',
    agencyApplicationId: plan.applicationId,
    agencyReviewEventId: createAgencyReviewEvent?.id,
  };
};

export default defineLogicFunction({
  universalIdentifier: LIFECYCLE_LOGIC_FUNCTION_IDS.rejectApplication,
  name: 'reject-agency-application',
  description:
    'Rejects an agency application while preserving reason, risk state, and review evidence.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: '/agency/applications/reject',
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
