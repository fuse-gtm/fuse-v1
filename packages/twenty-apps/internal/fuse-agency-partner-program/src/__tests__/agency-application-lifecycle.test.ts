import assert from 'node:assert/strict';
import {
  AgencyLifecycleValidationError,
  createAgencyApprovalPlan,
  createAgencyRejectionPlan,
  createAgencySubmissionPlan,
} from 'src/lifecycle/agency-application-lifecycle';

const now = '2026-06-20T12:00:00.000Z';

const submissionInput = {
  agencyName: 'Acme Agency',
  applicantName: 'Ada Partner',
  applicantEmail: 'Ada@AcmeAgency.com',
  website: 'https://www.acmeagency.com/services',
  serviceBuckets: ['revenue_ops'],
  monthlyLeadVolumeBand: 'eleven_to_fifty',
};

{
  const plan = createAgencySubmissionPlan(submissionInput, now);

  assert.equal(plan.isDuplicate, false);
  assert.equal(plan.duplicateKey, 'acmeagency.com:ada@acmeagency.com');
  assert.equal(plan.applicationData.status, 'SUBMITTED');
  assert.equal(plan.applicationData.riskState, 'CLEAR');
  assert.deepEqual(plan.applicationData.serviceBuckets, ['REVENUE_OPS']);
  assert.equal(plan.applicationData.monthlyLeadVolumeBand, 'ELEVEN_TO_FIFTY');
  assert.equal(plan.applicationData.normalizedDomain, 'acmeagency.com');
  assert.equal(plan.companyData?.name, 'Acme Agency');
  assert.equal(plan.personData?.emails.primaryEmail, 'ada@acmeagency.com');
  assert.equal(plan.reviewEventData.action, 'SUBMITTED');
}

{
  assert.throws(
    () =>
      createAgencySubmissionPlan({
        ...submissionInput,
        applicantEmail: '',
      }),
    (error) =>
      error instanceof AgencyLifecycleValidationError &&
      error.code === 'MISSING_REQUIRED_FIELD' &&
      error.field === 'applicantEmail',
  );
}

{
  const plan = createAgencySubmissionPlan(
    {
      ...submissionInput,
      existingApplicationId: 'existing-application-id',
      riskSignals: { matchingDomain: true },
    },
    now,
  );

  assert.equal(plan.isDuplicate, true);
  assert.equal(plan.applicationData.status, 'NEEDS_REVIEW');
  assert.equal(plan.applicationData.riskState, 'NEEDS_REVIEW');
  assert.equal(plan.reviewEventData.action, 'DUPLICATE_DETECTED');
  assert.match(plan.reviewEventData.evidenceJson, /existing-application-id/);
}

{
  const plan = createAgencySubmissionPlan(
    {
      ...submissionInput,
      existingCompanyId: 'company-id',
      existingPersonId: 'person-id',
    },
    now,
  );

  assert.equal(plan.companyData, null);
  assert.equal(plan.personData, null);
  assert.equal(plan.applicationData.companyId, 'company-id');
  assert.equal(plan.applicationData.personId, 'person-id');
}

{
  const plan = createAgencyApprovalPlan({
    applicationId: 'application-id',
    agencyName: 'Acme Agency',
    website: 'acmeagency.com',
    companyId: 'company-id',
    personId: 'person-id',
    reviewerId: 'reviewer-id',
    reason: 'Strong services fit.',
    occurredAt: now,
  });

  assert.equal(plan.needsPartnerProfile, true);
  assert.equal(plan.needsAgencyGroup, true);
  assert.equal(plan.partnerProfileData?.partnerType, 'AGENCY');
  assert.deepEqual(plan.partnerProfileData?.programMechanics, [
    'REFERRAL',
    'SERVICES',
  ]);
  assert.equal(plan.agencyGroupData?.name, 'Default Agency Partners');
  assert.equal(plan.enrollmentData.status, 'ACTIVE');
  assert.equal(plan.applicationUpdateData.status, 'APPROVED');
  assert.equal(plan.reviewEventData.action, 'APPROVED');
  assert.match(plan.reviewEventData.evidenceJson, /reviewer-id/);
}

{
  const plan = createAgencyRejectionPlan({
    applicationId: 'application-id',
    agencyName: 'Acme Agency',
    reviewerId: 'reviewer-id',
    reason: 'Low-quality traffic source.',
    riskState: 'fraud_review',
    evidence: { trafficSource: 'unknown' },
    occurredAt: now,
  });

  assert.equal(plan.applicationUpdateData.status, 'REJECTED');
  assert.equal(plan.applicationUpdateData.riskState, 'FRAUD_REVIEW');
  assert.equal(
    plan.applicationUpdateData.reviewDecisionReason,
    'Low-quality traffic source.',
  );
  assert.equal(plan.reviewEventData.action, 'REJECTED');
  assert.match(plan.reviewEventData.evidenceJson, /trafficSource/);
}

console.log('Fuse Agency application lifecycle validation passed.');
