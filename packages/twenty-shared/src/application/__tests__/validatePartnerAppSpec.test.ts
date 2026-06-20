import { validatePartnerAppSpec } from '@/application/validatePartnerAppSpec';
import { type PartnerAppSpec } from '@/application/partnerAppSpecType';

const buildAgencyPartnerAppSpec = (
  overrides: Partial<PartnerAppSpec> = {},
): PartnerAppSpec => ({
  application: {
    universalIdentifier: 'fuse.agency-partner-program',
    defaultRoleUniversalIdentifier: 'fuse.role.agency-operator',
    displayName: 'Agency Partner Program',
    description: 'Manage agency partner applications and operations.',
    packageJsonChecksum: null,
    yarnLockChecksum: null,
    applicationVariables: {
      FUSE_PUBLIC_INTAKE_BASE_URL: {
        universalIdentifier: 'fuse.var.public-intake-base-url',
        description: 'Base URL for agency application intake.',
      },
    },
  },
  version: '0.1.0',
  taxonomy: {
    partnerType: 'agency',
    programMechanics: ['referral', 'services'],
    commercialModels: ['commission', 'co_marketing', 'certifications'],
    ecosystems: ['hubspot', 'salesforce'],
  },
  requiredApplicationVariables: ['FUSE_PUBLIC_INTAKE_BASE_URL'],
  standardObjectExtensions: [
    {
      objectUniversalIdentifier: 'standard.company',
      fields: [],
      views: [],
      pageLayouts: [],
      navigationMenuItems: [],
    },
  ],
  customObjects: [
    {
      universalIdentifier: 'fuse.object.agency-application',
      nameSingular: 'agencyApplication',
      namePlural: 'agencyApplications',
      labelSingular: 'Agency Application',
      labelPlural: 'Agency Applications',
      fields: [],
      labelIdentifierFieldMetadataUniversalIdentifier:
        'fuse.field.agency-application.name',
    },
  ],
  relationFields: [],
  roles: [
    {
      universalIdentifier: 'fuse.role.agency-operator',
      label: 'Agency Operator',
      canBeAssignedToUsers: true,
    },
  ],
  views: [],
  pageLayouts: [],
  navigationMenuItems: [],
  frontComponents: [],
  logicFunctions: [],
  skills: [],
  agents: [],
  installHooks: {
    postInstallLogicFunctionUniversalIdentifier:
      'fuse.logic-function.seed-agency-program',
  },
  seedData: [
    {
      universalIdentifier: 'fuse.seed.default-agency-tiers',
      targetObjectUniversalIdentifier: 'fuse.object.agency-tier',
      label: 'Default agency tiers',
      records: [{ name: 'Certified' }],
    },
  ],
  ...overrides,
});

describe('validatePartnerAppSpec', () => {
  it('accepts a valid agency PartnerAppSpec', () => {
    const result = validatePartnerAppSpec(buildAgencyPartnerAppSpec());

    expect(result).toEqual({ valid: true, issues: [] });
  });

  it('rejects referral or affiliate as an Axis 1 partner type', () => {
    const result = validatePartnerAppSpec(
      buildAgencyPartnerAppSpec({
        taxonomy: {
          partnerType: 'affiliate',
          programMechanics: ['referral'],
          commercialModels: ['commission'],
        },
      } as unknown as Partial<PartnerAppSpec>),
    );

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'AXIS_CONFLATION',
          path: 'taxonomy.partnerType',
        }),
      ]),
    );
  });

  it('rejects agency as a program mechanic', () => {
    const result = validatePartnerAppSpec(
      buildAgencyPartnerAppSpec({
        taxonomy: {
          partnerType: 'agency',
          programMechanics: ['agency'],
          commercialModels: ['commission'],
        },
      } as unknown as Partial<PartnerAppSpec>),
    );

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'AXIS_CONFLATION',
          path: 'taxonomy.programMechanics[0]',
        }),
      ]),
    );
  });

  it('validates commercial models independently from partner type and program mechanic', () => {
    const result = validatePartnerAppSpec(
      buildAgencyPartnerAppSpec({
        taxonomy: {
          partnerType: 'agency',
          programMechanics: ['referral'],
          commercialModels: ['referral'],
        },
      } as unknown as Partial<PartnerAppSpec>),
    );

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'INVALID_COMMERCIAL_MODEL',
          path: 'taxonomy.commercialModels[0]',
        }),
      ]),
    );
  });

  it('rejects duplicate universal identifiers across app entities', () => {
    const result = validatePartnerAppSpec(
      buildAgencyPartnerAppSpec({
        roles: [
          {
            universalIdentifier: 'fuse.object.agency-application',
            label: 'Duplicated Identifier Role',
          },
        ],
      }),
    );

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'DUPLICATE_UNIVERSAL_IDENTIFIER',
          path: 'roles[0].universalIdentifier',
        }),
      ]),
    );
  });

  it('rejects missing required application variables', () => {
    const result = validatePartnerAppSpec(
      buildAgencyPartnerAppSpec({
        requiredApplicationVariables: [
          'FUSE_PUBLIC_INTAKE_BASE_URL',
          'FUSE_SIGNING_SECRET',
        ],
      }),
    );

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'MISSING_REQUIRED_APPLICATION_VARIABLE',
          path: 'requiredApplicationVariables[1]',
        }),
      ]),
    );
  });
});
