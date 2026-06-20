import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { createAgencySubmissionPlan } from 'src/lifecycle/agency-application-lifecycle';
import { LIFECYCLE_LOGIC_FUNCTION_IDS } from 'src/constants/universal-identifiers';

const handler = async (
  event: RoutePayload<Parameters<typeof createAgencySubmissionPlan>[0]>,
) => {
  const plan = createAgencySubmissionPlan(event.body ?? {});
  const client = new CoreApiClient() as any;

  let companyId = plan.applicationData.companyId;
  let personId = plan.applicationData.personId;

  if (!companyId && plan.companyData) {
    const { createCompany } = await client.mutation({
      createCompany: {
        __args: { data: plan.companyData },
        id: true,
      },
    } as any);

    companyId = createCompany?.id;
  }

  if (!personId && plan.personData) {
    const { createPerson } = await client.mutation({
      createPerson: {
        __args: { data: plan.personData },
        id: true,
      },
    } as any);

    personId = createPerson?.id;
  }

  const { createAgencyApplication } = await client.mutation({
    createAgencyApplication: {
      __args: {
        data: {
          ...plan.applicationData,
          companyId,
          personId,
        },
      },
      id: true,
    },
  } as any);

  const agencyApplicationId = createAgencyApplication?.id;

  if (agencyApplicationId) {
    await client.mutation({
      createAgencyReviewEvent: {
        __args: {
          data: {
            ...plan.reviewEventData,
            applicationId: agencyApplicationId,
          },
        },
        id: true,
      },
    } as any);
  }

  return {
    status: plan.isDuplicate ? 'DUPLICATE_DETECTED' : 'SUBMITTED',
    agencyApplicationId,
    companyId,
    personId,
    duplicateKey: plan.duplicateKey,
  };
};

export default defineLogicFunction({
  universalIdentifier: LIFECYCLE_LOGIC_FUNCTION_IDS.submitApplication,
  name: 'submit-agency-application',
  description:
    'Normalizes and creates an agency application with matching Company/Person links and an audit event.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: '/agency/applications/submit',
    httpMethod: 'POST',
    isAuthRequired: false,
  },
});
