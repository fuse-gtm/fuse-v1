import { type PartnerAppSpec } from 'twenty-shared/application';
import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  FIELD_IDS,
  NAVIGATION_IDS,
  OBJECT_IDS,
  POST_INSTALL_UNIVERSAL_IDENTIFIER,
  SEED_DATA_IDS,
  VIEW_IDS,
} from 'src/constants/universal-identifiers';

const STANDARD_OBJECT_IDS = {
  company: '20202020-b374-4779-a561-80086cb2e17f',
  opportunity: '20202020-9549-49dd-b2b2-883999db8938',
  person: '20202020-e674-48e5-a542-72570eee7213',
} as const;

export const fusePartnerCoreSpec: PartnerAppSpec = {
  application: {
    universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    displayName: 'Fuse Partner Core',
    description:
      'Shared Fuse partner taxonomy, standard object extensions, and partner operating primitives.',
    defaultRoleUniversalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
    packageJsonChecksum: null,
    yarnLockChecksum: null,
  },
  version: '0.1.0',
  taxonomy: {
    partnerType: 'agency',
    programMechanics: [
      'referral',
      'services',
      'marketplace',
      'technology',
      'reseller',
    ],
    commercialModels: [
      'commission',
      'flat_fee',
      'warrant',
      'revenue_share',
      'margin',
      'co_marketing',
      'product_benefits',
      'certifications',
    ],
    ecosystems: ['Fuse'],
  },
  standardObjectExtensions: [
    {
      objectUniversalIdentifier: STANDARD_OBJECT_IDS.company,
      fields: [
        { universalIdentifier: FIELD_IDS.company.isPartner },
        { universalIdentifier: FIELD_IDS.company.partnerType },
        { universalIdentifier: FIELD_IDS.company.programMechanics },
        { universalIdentifier: FIELD_IDS.company.commercialModels },
        { universalIdentifier: FIELD_IDS.company.partnerStatus },
        { universalIdentifier: FIELD_IDS.company.partnerProfiles },
      ] as any,
    },
    {
      objectUniversalIdentifier: STANDARD_OBJECT_IDS.person,
      fields: [
        { universalIdentifier: FIELD_IDS.person.isPartnerContact },
        { universalIdentifier: FIELD_IDS.person.partnerRole },
        { universalIdentifier: FIELD_IDS.person.partnerProfiles },
      ] as any,
    },
    {
      objectUniversalIdentifier: STANDARD_OBJECT_IDS.opportunity,
      fields: [
        { universalIdentifier: FIELD_IDS.opportunity.partnerSource },
        { universalIdentifier: FIELD_IDS.opportunity.attributionStatus },
        { universalIdentifier: FIELD_IDS.opportunity.attributionNotes },
        { universalIdentifier: FIELD_IDS.opportunity.sourcedPartnerProfile },
      ] as any,
    },
  ],
  customObjects: [
    { universalIdentifier: OBJECT_IDS.partnerProfile },
    { universalIdentifier: OBJECT_IDS.partnerProgram },
    { universalIdentifier: OBJECT_IDS.partnerEnrollment },
  ] as any,
  relationFields: [
    { universalIdentifier: FIELD_IDS.partnerProfile.company },
    { universalIdentifier: FIELD_IDS.partnerProfile.primaryContact },
    { universalIdentifier: FIELD_IDS.partnerProfile.enrollments },
    { universalIdentifier: FIELD_IDS.partnerProfile.sourcedOpportunities },
    { universalIdentifier: FIELD_IDS.partnerProgram.enrollments },
    { universalIdentifier: FIELD_IDS.partnerEnrollment.partnerProfile },
    { universalIdentifier: FIELD_IDS.partnerEnrollment.partnerProgram },
  ] as any,
  roles: [{ universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER }] as any,
  views: [
    { universalIdentifier: VIEW_IDS.partnerProfiles },
    { universalIdentifier: VIEW_IDS.activeEnrollments },
    { universalIdentifier: VIEW_IDS.partnerPrograms },
  ] as any,
  pageLayouts: [],
  navigationMenuItems: [
    { universalIdentifier: NAVIGATION_IDS.folder },
    { universalIdentifier: NAVIGATION_IDS.partnerProfiles },
    { universalIdentifier: NAVIGATION_IDS.activeEnrollments },
    { universalIdentifier: NAVIGATION_IDS.partnerPrograms },
  ] as any,
  frontComponents: [],
  logicFunctions: [
    {
      universalIdentifier: POST_INSTALL_UNIVERSAL_IDENTIFIER,
      name: 'seed-fuse-partner-core',
      sourceHandlerPath: 'src/logic-functions/post-install.ts',
      builtHandlerPath: 'src/logic-functions/post-install.mjs',
      builtHandlerChecksum: null,
      handlerName: 'default.config.handler',
      toolInputSchema: {},
    },
  ] as any,
  skills: [],
  agents: [],
  installHooks: {
    postInstallLogicFunctionUniversalIdentifier:
      POST_INSTALL_UNIVERSAL_IDENTIFIER,
  },
  seedData: [
    {
      universalIdentifier: SEED_DATA_IDS.partnerPrograms,
      targetObjectUniversalIdentifier: OBJECT_IDS.partnerProgram,
      label: 'Starter partner programs',
      records: [
        {
          name: 'Fuse Referral Program',
          programMechanic: 'referral',
          ecosystem: 'Fuse',
          commercialModels: ['commission', 'co_marketing'],
        },
      ],
    },
    {
      universalIdentifier: SEED_DATA_IDS.partnerProfiles,
      targetObjectUniversalIdentifier: OBJECT_IDS.partnerProfile,
      label: 'Starter partner profiles',
      records: [
        {
          name: 'Example Agency Partner',
          primaryDomain: 'example-agency.com',
          partnerType: 'agency',
          programMechanics: ['referral', 'services'],
          commercialModels: ['commission', 'certifications'],
        },
      ],
    },
    {
      universalIdentifier: SEED_DATA_IDS.partnerEnrollments,
      targetObjectUniversalIdentifier: OBJECT_IDS.partnerEnrollment,
      label: 'Starter partner enrollments',
      records: [
        {
          name: 'Example Agency Partner - Fuse Referral Program',
          status: 'active',
        },
      ],
    },
  ],
};
