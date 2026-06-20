import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { createAgencyApprovalPlan } from 'src/lifecycle/agency-application-lifecycle';
import { LIFECYCLE_LOGIC_FUNCTION_IDS } from 'src/constants/universal-identifiers';

const handler = async (
  event: RoutePayload<Parameters<typeof createAgencyApprovalPlan>[0]>,
) => {
  const plan = createAgencyApprovalPlan(event.body ?? {});
  const client = new CoreApiClient() as any;

  let partnerProfileId = plan.applicationUpdateData.partnerProfileId;
  let agencyGroupId = plan.applicationUpdateData.agencyGroupId;

  if (!partnerProfileId && plan.partnerProfileData) {
    const { createPartnerProfile } = await client.mutation({
      createPartnerProfile: {
        __args: { data: plan.partnerProfileData },
        id: true,
      },
    } as any);

    partnerProfileId = createPartnerProfile?.id;
  }

  if (!agencyGroupId && plan.agencyGroupData) {
    const { createAgencyGroup } = await client.mutation({
      createAgencyGroup: {
        __args: {
          data: {
            ...plan.agencyGroupData,
            partnerProfileId,
          },
        },
        id: true,
      },
    } as any);

    agencyGroupId = createAgencyGroup?.id;
  }

  const enrollmentData = {
    ...plan.enrollmentData,
    partnerProfileId,
  };

  const { createPartnerEnrollment } = await client.mutation({
    createPartnerEnrollment: {
      __args: { data: enrollmentData },
      id: true,
    },
  } as any);

  await client.mutation({
    updateAgencyApplication: {
      __args: {
        id: plan.applicationId,
        data: {
          ...plan.applicationUpdateData,
          partnerProfileId,
          agencyGroupId,
        },
      },
      id: true,
    },
  } as any);

  await client.mutation({
    createAgencyResource: {
      __args: {
        data: {
          ...plan.starterResourceData,
          partnerProfileId,
        },
      },
      id: true,
    },
  } as any);

  await client.mutation({
    createAgencyTask: {
      __args: {
        data: {
          ...plan.starterTaskData,
          partnerProfileId,
        },
      },
      id: true,
    },
  } as any);

  await client.mutation({
    createAgencyReviewEvent: {
      __args: {
        data: {
          ...plan.reviewEventData,
          applicationId: plan.applicationId,
          partnerProfileId,
          agencyGroupId,
        },
      },
      id: true,
    },
  } as any);

  return {
    status: 'APPROVED',
    agencyApplicationId: plan.applicationId,
    partnerProfileId,
    agencyGroupId,
    partnerEnrollmentId: createPartnerEnrollment?.id,
  };
};

export default defineLogicFunction({
  universalIdentifier: LIFECYCLE_LOGIC_FUNCTION_IDS.approveApplication,
  name: 'approve-agency-application',
  description:
    'Approves an agency application, creates or links partner profile/group/enrollment, and records audit evidence.',
  timeoutSeconds: 45,
  handler,
  httpRouteTriggerSettings: {
    path: '/agency/applications/approve',
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
