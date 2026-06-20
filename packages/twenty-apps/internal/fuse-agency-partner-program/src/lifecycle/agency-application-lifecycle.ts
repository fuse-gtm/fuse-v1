export type AgencyApplicationSubmissionInput = {
  agencyName?: string;
  applicantName?: string;
  applicantEmail?: string;
  website?: string;
  serviceBuckets?: string[];
  monthlyLeadVolumeBand?: string;
  existingApplicationId?: string;
  existingCompanyId?: string;
  existingPersonId?: string;
  existingPartnerProfileId?: string;
  riskSignals?: Record<string, unknown>;
};

export type AgencyApplicationApprovalInput = {
  applicationId?: string;
  agencyName?: string;
  website?: string;
  companyId?: string;
  personId?: string;
  partnerProfileId?: string;
  partnerProgramId?: string;
  agencyGroupId?: string;
  reviewerId?: string;
  reason?: string;
  occurredAt?: string;
};

export type AgencyApplicationRejectionInput = {
  applicationId?: string;
  agencyName?: string;
  reviewerId?: string;
  reason?: string;
  riskState?:
    | 'needs_review'
    | 'fraud_review'
    | 'blocked'
    | 'NEEDS_REVIEW'
    | 'FRAUD_REVIEW'
    | 'BLOCKED';
  occurredAt?: string;
  evidence?: Record<string, unknown>;
};

export type AgencyLifecycleValidationCode =
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_EMAIL'
  | 'INVALID_DOMAIN';

export class AgencyLifecycleValidationError extends Error {
  constructor(
    readonly code: AgencyLifecycleValidationCode,
    readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = 'AgencyLifecycleValidationError';
  }
}

const requireString = (
  value: string | undefined,
  field: string,
): string => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new AgencyLifecycleValidationError(
      'MISSING_REQUIRED_FIELD',
      field,
      `${field} is required.`,
    );
  }

  return normalizedValue;
};

const normalizeEmail = (email: string): string => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail)) {
    throw new AgencyLifecycleValidationError(
      'INVALID_EMAIL',
      'applicantEmail',
      'applicantEmail must be a valid email address.',
    );
  }

  return normalizedEmail;
};

const normalizeDomain = (website: string): string => {
  const websiteWithProtocol = /^https?:\/\//i.test(website)
    ? website
    : `https://${website}`;

  let hostname: string;

  try {
    hostname = new URL(websiteWithProtocol).hostname.toLowerCase();
  } catch {
    throw new AgencyLifecycleValidationError(
      'INVALID_DOMAIN',
      'website',
      'website must include a valid domain.',
    );
  }

  return hostname.replace(/^www\./, '');
};

const stableJson = (value: Record<string, unknown>) =>
  JSON.stringify(
    Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = value[key];

        return acc;
      }, {}),
  );

const toStoredSelectValue = (value: string | undefined) =>
  value?.trim().toUpperCase();

const toStoredMultiSelectValues = (values: string[] | undefined) =>
  values?.map((value) => value.trim().toUpperCase());

export const createAgencySubmissionPlan = (
  input: AgencyApplicationSubmissionInput,
  now = new Date().toISOString(),
) => {
  const agencyName = requireString(input.agencyName, 'agencyName');
  const applicantEmail = normalizeEmail(
    requireString(input.applicantEmail, 'applicantEmail'),
  );
  const website = requireString(input.website, 'website');
  const normalizedDomain = normalizeDomain(website);
  const duplicateKey = `${normalizedDomain}:${applicantEmail}`;
  const isDuplicate = Boolean(input.existingApplicationId);
  const riskState = isDuplicate ? 'NEEDS_REVIEW' : 'CLEAR';
  const reviewAction = isDuplicate ? 'DUPLICATE_DETECTED' : 'SUBMITTED';
  const reviewReason = isDuplicate
    ? `Duplicate applicant for ${duplicateKey}; preserve review evidence.`
    : 'Application submitted for agency partner review.';

  return {
    duplicateKey,
    isDuplicate,
    companyData: input.existingCompanyId
      ? null
      : {
          name: agencyName,
          domainName: normalizedDomain,
        },
    personData: input.existingPersonId
      ? null
      : {
          name: input.applicantName?.trim() || agencyName,
          emails: {
            primaryEmail: applicantEmail,
            additionalEmails: [],
          },
        },
    applicationData: {
      name: `${agencyName} Application`,
      status: isDuplicate ? 'NEEDS_REVIEW' : 'SUBMITTED',
      submittedAt: now,
      website,
      applicantName: input.applicantName?.trim() || agencyName,
      applicantEmail,
      normalizedDomain,
      duplicateKey,
      riskState,
      serviceBuckets: toStoredMultiSelectValues(input.serviceBuckets) ?? [],
      monthlyLeadVolumeBand: toStoredSelectValue(
        input.monthlyLeadVolumeBand,
      ),
      reviewDecisionReason: reviewReason,
      companyId: input.existingCompanyId,
      personId: input.existingPersonId,
      partnerProfileId: input.existingPartnerProfileId,
    },
    reviewEventData: {
      name: `${agencyName} ${isDuplicate ? 'duplicate check' : 'submission'}`,
      action: reviewAction,
      reason: reviewReason,
      occurredAt: now,
      evidenceJson: stableJson({
        duplicateKey,
        existingApplicationId: input.existingApplicationId ?? null,
        existingCompanyId: input.existingCompanyId ?? null,
        existingPersonId: input.existingPersonId ?? null,
        riskSignals: input.riskSignals ?? {},
      }),
    },
  };
};

export const createAgencyApprovalPlan = (
  input: AgencyApplicationApprovalInput,
) => {
  const applicationId = requireString(input.applicationId, 'applicationId');
  const agencyName = requireString(input.agencyName, 'agencyName');
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const normalizedDomain = input.website ? normalizeDomain(input.website) : null;
  const reviewReason = input.reason?.trim() || 'Agency application approved.';

  return {
    applicationId,
    needsPartnerProfile: !input.partnerProfileId,
    needsAgencyGroup: !input.agencyGroupId,
    partnerProfileData: input.partnerProfileId
      ? null
      : {
          name: agencyName,
          primaryDomain: normalizedDomain,
          partnerType: 'AGENCY',
          partnerSubtypes: ['REVENUE_OPS'],
          programMechanics: ['REFERRAL', 'SERVICES'],
          commercialModels: ['COMMISSION', 'CERTIFICATIONS'],
          status: 'ACTIVE',
          companyId: input.companyId,
          primaryContactId: input.personId,
        },
    agencyGroupData: input.agencyGroupId
      ? null
      : {
          name: 'Default Agency Partners',
          tier: 'STANDARD',
          status: 'ACTIVE',
        },
    enrollmentData: {
      name: `${agencyName} - Agency Partner Program`,
      status: 'ACTIVE',
      startedAt: occurredAt.slice(0, 10),
      notes: reviewReason,
      partnerProfileId: input.partnerProfileId,
      partnerProgramId: input.partnerProgramId,
    },
    applicationUpdateData: {
      status: 'APPROVED',
      reviewedAt: occurredAt,
      riskState: 'CLEAR',
      reviewDecisionReason: reviewReason,
      partnerProfileId: input.partnerProfileId,
      agencyGroupId: input.agencyGroupId,
    },
    starterResourceData: {
      name: `${agencyName} Agency Enablement Pack`,
      resourceType: 'PLAYBOOK',
      status: 'DRAFT',
    },
    starterTaskData: {
      name: `Complete ${agencyName} onboarding`,
      taskType: 'ENABLEMENT',
      status: 'OPEN',
      dueAt: occurredAt,
    },
    reviewEventData: {
      name: `${agencyName} approved`,
      action: 'APPROVED',
      reason: reviewReason,
      occurredAt,
      evidenceJson: stableJson({
        reviewerId: input.reviewerId ?? null,
        applicationId,
        partnerProfileId: input.partnerProfileId ?? null,
        agencyGroupId: input.agencyGroupId ?? null,
      }),
    },
  };
};

export const createAgencyRejectionPlan = (
  input: AgencyApplicationRejectionInput,
) => {
  const applicationId = requireString(input.applicationId, 'applicationId');
  const agencyName = requireString(input.agencyName, 'agencyName');
  const reason = requireString(input.reason, 'reason');
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const riskState = toStoredSelectValue(input.riskState) ?? 'NEEDS_REVIEW';

  return {
    applicationId,
    applicationUpdateData: {
      status: 'REJECTED',
      reviewedAt: occurredAt,
      riskState,
      reviewDecisionReason: reason,
    },
    reviewEventData: {
      name: `${agencyName} rejected`,
      action: 'REJECTED',
      reason,
      occurredAt,
      evidenceJson: stableJson({
        reviewerId: input.reviewerId ?? null,
        applicationId,
        riskState,
        evidence: input.evidence ?? {},
      }),
    },
  };
};
