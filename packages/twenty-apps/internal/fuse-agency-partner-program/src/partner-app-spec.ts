import { type PartnerAppSpec } from 'twenty-shared/application';
import { STANDARD_OBJECT_IDS } from 'src/constants/core-identifiers';
import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  APPLICATION_VARIABLE_IDS,
  ATTRIBUTION_LOGIC_FUNCTION_IDS,
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  FIELD_IDS,
  FRONT_COMPONENT_IDS,
  FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  LIFECYCLE_LOGIC_FUNCTION_IDS,
  NAVIGATION_IDS,
  OBJECT_IDS,
  PAGE_LAYOUT_IDS,
  POST_INSTALL_UNIVERSAL_IDENTIFIER,
  SEED_DATA_IDS,
  AGENT_IDS,
  SKILL_IDS,
  VIEW_IDS,
} from 'src/constants/universal-identifiers';

export const fuseAgencyPartnerProgramSpec: PartnerAppSpec = {
  application: {
    universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    displayName: 'Fuse Agency Partner Program',
    description:
      'Agency-specific partner program schema, operator views, and overview widget built on Fuse Partner Core.',
    defaultRoleUniversalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
    applicationVariables: {
      AGENCY_EVENT_SIGNING_SECRET: {
        universalIdentifier:
          APPLICATION_VARIABLE_IDS.agencyEventSigningSecret,
        description:
          'Secret used to validate signed agency referral lead and sale events.',
        isSecret: true,
      },
    },
    packageJsonChecksum: null,
    yarnLockChecksum: null,
  },
  version: '0.1.0',
  requiredApplicationVariables: ['AGENCY_EVENT_SIGNING_SECRET'],
  taxonomy: {
    partnerType: 'agency',
    programMechanics: ['referral', 'services'],
    commercialModels: [
      'commission',
      'flat_fee',
      'revenue_share',
      'co_marketing',
      'product_benefits',
      'certifications',
    ],
    ecosystems: ['Fuse', 'HubSpot', 'Shopify', 'Salesforce', 'PartnerVue'],
  },
  standardObjectExtensions: [
    {
      objectUniversalIdentifier: STANDARD_OBJECT_IDS.company,
      fields: [{ universalIdentifier: FIELD_IDS.company.agencyApplications }] as any,
    },
    {
      objectUniversalIdentifier: STANDARD_OBJECT_IDS.person,
      fields: [{ universalIdentifier: FIELD_IDS.person.agencyApplications }] as any,
    },
    {
      objectUniversalIdentifier: STANDARD_OBJECT_IDS.opportunity,
      fields: [
        { universalIdentifier: FIELD_IDS.opportunity.agencyAttributions },
      ] as any,
    },
  ],
  customObjects: [
    { universalIdentifier: OBJECT_IDS.agencyApplication },
    { universalIdentifier: OBJECT_IDS.agencyServiceCapability },
    { universalIdentifier: OBJECT_IDS.agencyResource },
    { universalIdentifier: OBJECT_IDS.agencyAttribution },
    { universalIdentifier: OBJECT_IDS.agencyTask },
    { universalIdentifier: OBJECT_IDS.agencyGroup },
    { universalIdentifier: OBJECT_IDS.agencyReviewEvent },
    { universalIdentifier: OBJECT_IDS.agencyReferralEvent },
    { universalIdentifier: OBJECT_IDS.agencyReferralRollup },
  ] as any,
  relationFields: [
    { universalIdentifier: FIELD_IDS.agencyApplication.partnerProfile },
    { universalIdentifier: FIELD_IDS.agencyApplication.company },
    { universalIdentifier: FIELD_IDS.agencyApplication.person },
    { universalIdentifier: FIELD_IDS.agencyServiceCapability.partnerProfile },
    { universalIdentifier: FIELD_IDS.agencyResource.partnerProfile },
    { universalIdentifier: FIELD_IDS.agencyAttribution.partnerProfile },
    { universalIdentifier: FIELD_IDS.agencyAttribution.opportunity },
    { universalIdentifier: FIELD_IDS.agencyTask.partnerProfile },
    { universalIdentifier: FIELD_IDS.agencyApplication.agencyGroup },
    { universalIdentifier: FIELD_IDS.agencyApplication.reviewEvents },
    { universalIdentifier: FIELD_IDS.agencyGroup.partnerProfile },
    { universalIdentifier: FIELD_IDS.agencyGroup.applications },
    { universalIdentifier: FIELD_IDS.agencyGroup.reviewEvents },
    { universalIdentifier: FIELD_IDS.agencyReviewEvent.application },
    { universalIdentifier: FIELD_IDS.agencyReviewEvent.partnerProfile },
    { universalIdentifier: FIELD_IDS.agencyReviewEvent.agencyGroup },
    { universalIdentifier: FIELD_IDS.agencyReferralEvent.partnerProfile },
    { universalIdentifier: FIELD_IDS.agencyReferralEvent.agencyGroup },
    { universalIdentifier: FIELD_IDS.agencyReferralEvent.agencyAttribution },
    { universalIdentifier: FIELD_IDS.agencyReferralRollup.partnerProfile },
    { universalIdentifier: FIELD_IDS.agencyReferralRollup.agencyGroup },
    { universalIdentifier: FIELD_IDS.agencyGroup.referralEvents },
    { universalIdentifier: FIELD_IDS.agencyGroup.referralRollups },
    { universalIdentifier: FIELD_IDS.agencyAttribution.referralEvents },
    { universalIdentifier: FIELD_IDS.partnerProfile.agencyApplications },
    { universalIdentifier: FIELD_IDS.partnerProfile.serviceCapabilities },
    { universalIdentifier: FIELD_IDS.partnerProfile.resources },
    { universalIdentifier: FIELD_IDS.partnerProfile.attributions },
    { universalIdentifier: FIELD_IDS.partnerProfile.agencyTasks },
    { universalIdentifier: FIELD_IDS.partnerProfile.agencyGroups },
    { universalIdentifier: FIELD_IDS.partnerProfile.reviewEvents },
    { universalIdentifier: FIELD_IDS.partnerProfile.referralEvents },
    { universalIdentifier: FIELD_IDS.partnerProfile.referralRollups },
  ] as any,
  roles: [{ universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER }] as any,
  views: [
    { universalIdentifier: VIEW_IDS.applications },
    { universalIdentifier: VIEW_IDS.activeAgencies },
    { universalIdentifier: VIEW_IDS.serviceCapabilities },
    { universalIdentifier: VIEW_IDS.agencyContacts },
    { universalIdentifier: VIEW_IDS.resources },
    { universalIdentifier: VIEW_IDS.attribution },
    { universalIdentifier: VIEW_IDS.tasks },
    { universalIdentifier: VIEW_IDS.agencyGroups },
    { universalIdentifier: VIEW_IDS.reviewEvents },
    { universalIdentifier: VIEW_IDS.referralEvents },
    { universalIdentifier: VIEW_IDS.referralRollups },
  ] as any,
  pageLayouts: [{ universalIdentifier: PAGE_LAYOUT_IDS.partnerProfile }] as any,
  navigationMenuItems: [
    { universalIdentifier: NAVIGATION_IDS.folder },
    { universalIdentifier: NAVIGATION_IDS.applications },
    { universalIdentifier: NAVIGATION_IDS.activeAgencies },
    { universalIdentifier: NAVIGATION_IDS.serviceCapabilities },
    { universalIdentifier: NAVIGATION_IDS.agencyContacts },
    { universalIdentifier: NAVIGATION_IDS.resources },
    { universalIdentifier: NAVIGATION_IDS.attribution },
    { universalIdentifier: NAVIGATION_IDS.tasks },
    { universalIdentifier: NAVIGATION_IDS.agencyGroups },
    { universalIdentifier: NAVIGATION_IDS.reviewEvents },
    { universalIdentifier: NAVIGATION_IDS.referralEvents },
    { universalIdentifier: NAVIGATION_IDS.referralRollups },
  ] as any,
  frontComponents: [
    { universalIdentifier: FRONT_COMPONENT_UNIVERSAL_IDENTIFIER },
    { universalIdentifier: FRONT_COMPONENT_IDS.applicationReview },
    { universalIdentifier: FRONT_COMPONENT_IDS.performance },
  ] as any,
  logicFunctions: [
    {
      universalIdentifier: POST_INSTALL_UNIVERSAL_IDENTIFIER,
      name: 'seed-fuse-agency-partner-program',
      sourceHandlerPath: 'src/logic-functions/post-install.ts',
      builtHandlerPath: 'src/logic-functions/post-install.mjs',
      builtHandlerChecksum: null,
      handlerName: 'default.config.handler',
      toolInputSchema: {},
    },
    {
      universalIdentifier: LIFECYCLE_LOGIC_FUNCTION_IDS.submitApplication,
      name: 'submit-agency-application',
      sourceHandlerPath:
        'src/logic-functions/lifecycle/submit-agency-application.logic-function.ts',
      builtHandlerPath:
        'src/logic-functions/lifecycle/submit-agency-application.logic-function.mjs',
      builtHandlerChecksum: null,
      handlerName: 'default.config.handler',
      toolInputSchema: {},
    },
    {
      universalIdentifier: LIFECYCLE_LOGIC_FUNCTION_IDS.approveApplication,
      name: 'approve-agency-application',
      sourceHandlerPath:
        'src/logic-functions/lifecycle/approve-agency-application.logic-function.ts',
      builtHandlerPath:
        'src/logic-functions/lifecycle/approve-agency-application.logic-function.mjs',
      builtHandlerChecksum: null,
      handlerName: 'default.config.handler',
      toolInputSchema: {},
    },
    {
      universalIdentifier: LIFECYCLE_LOGIC_FUNCTION_IDS.rejectApplication,
      name: 'reject-agency-application',
      sourceHandlerPath:
        'src/logic-functions/lifecycle/reject-agency-application.logic-function.ts',
      builtHandlerPath:
        'src/logic-functions/lifecycle/reject-agency-application.logic-function.mjs',
      builtHandlerChecksum: null,
      handlerName: 'default.config.handler',
      toolInputSchema: {},
    },
    {
      universalIdentifier: ATTRIBUTION_LOGIC_FUNCTION_IDS.ingestReferralEvent,
      name: 'ingest-agency-referral-event',
      sourceHandlerPath:
        'src/logic-functions/lifecycle/ingest-agency-referral-event.logic-function.ts',
      builtHandlerPath:
        'src/logic-functions/lifecycle/ingest-agency-referral-event.logic-function.mjs',
      builtHandlerChecksum: null,
      handlerName: 'default.config.handler',
      toolInputSchema: {},
    },
    {
      universalIdentifier: ATTRIBUTION_LOGIC_FUNCTION_IDS.repairReferralRollups,
      name: 'repair-agency-referral-rollups',
      sourceHandlerPath:
        'src/logic-functions/lifecycle/repair-agency-referral-rollups.logic-function.ts',
      builtHandlerPath:
        'src/logic-functions/lifecycle/repair-agency-referral-rollups.logic-function.mjs',
      builtHandlerChecksum: null,
      handlerName: 'default.config.handler',
      toolInputSchema: {},
    },
  ] as any,
  skills: [
    { universalIdentifier: SKILL_IDS.agencyProgramOperator },
  ] as any,
  agents: [
    { universalIdentifier: AGENT_IDS.agencyProgramOperator },
  ] as any,
  installHooks: {
    postInstallLogicFunctionUniversalIdentifier:
      POST_INSTALL_UNIVERSAL_IDENTIFIER,
  },
  seedData: [
    {
      universalIdentifier: SEED_DATA_IDS.applications,
      targetObjectUniversalIdentifier: OBJECT_IDS.agencyApplication,
      label: 'Starter agency applications',
      records: [
        {
          name: 'Example Agency Application',
          status: 'needs_review',
          applicantName: 'Example Agency Partner',
          applicantEmail: 'partner@example-agency.com',
          normalizedDomain: 'example-agency.com',
          duplicateKey: 'example-agency.com:partner@example-agency.com',
          riskState: 'clear',
          serviceBuckets: ['revenue_ops', 'technology_implementation'],
          monthlyLeadVolumeBand: 'eleven_to_fifty',
        },
      ],
    },
    {
      universalIdentifier: SEED_DATA_IDS.serviceCapabilities,
      targetObjectUniversalIdentifier: OBJECT_IDS.agencyServiceCapability,
      label: 'Starter agency service capabilities',
      records: [
        {
          name: 'Revenue Ops Implementation',
          serviceBucket: 'revenue_ops',
          platformFocus: 'hubspot',
          capacityBand: 'boutique',
        },
      ],
    },
    {
      universalIdentifier: SEED_DATA_IDS.resources,
      targetObjectUniversalIdentifier: OBJECT_IDS.agencyResource,
      label: 'Starter agency resources',
      records: [
        {
          name: 'Agency Referral Playbook',
          resourceType: 'playbook',
          status: 'draft',
        },
      ],
    },
    {
      universalIdentifier: SEED_DATA_IDS.tasks,
      targetObjectUniversalIdentifier: OBJECT_IDS.agencyTask,
      label: 'Starter agency tasks',
      records: [
        {
          name: 'Review Example Agency Application',
          taskType: 'application_review',
          status: 'open',
        },
      ],
    },
    {
      universalIdentifier: SEED_DATA_IDS.agencyGroups,
      targetObjectUniversalIdentifier: OBJECT_IDS.agencyGroup,
      label: 'Starter agency groups',
      records: [
        {
          name: 'Default Agency Partners',
          tier: 'standard',
          status: 'active',
        },
      ],
    },
  ],
};
