import { type AgentManifest } from '@/application/agentManifestType';
import { type ApplicationManifest } from '@/application/applicationType';
import { type ApplicationVariables } from '@/application/applicationVariablesType';
import { type FieldManifest } from '@/application/fieldManifestType';
import { type FrontComponentManifest } from '@/application/frontComponentManifestType';
import { type LogicFunctionManifest } from '@/application/logicFunctionManifestType';
import { type NavigationMenuItemManifest } from '@/application/navigationMenuItemManifestType';
import { type ObjectManifest } from '@/application/objectManifestType';
import { type PageLayoutManifest } from '@/application/pageLayoutManifestType';
import { type RoleManifest } from '@/application/roleManifestType';
import { type SkillManifest } from '@/application/skillManifestType';
import { type SyncableEntityOptions } from '@/application/syncableEntityOptionsType';
import { type ViewManifest } from '@/application/viewManifestType';

export const FUSE_PARTNER_TYPES = [
  'agency',
  'systems_integrator',
  'isv',
  'msp',
  'reseller',
  'consulting',
  'vc_pe',
  'professional_services',
] as const;

export const FUSE_PROGRAM_MECHANICS = [
  'referral',
  'services',
  'marketplace',
  'technology',
  'reseller',
] as const;

export const FUSE_COMMERCIAL_MODELS = [
  'commission',
  'flat_fee',
  'warrant',
  'revenue_share',
  'margin',
  'co_marketing',
  'product_benefits',
  'certifications',
] as const;

export type FusePartnerType = (typeof FUSE_PARTNER_TYPES)[number];

export type FuseProgramMechanic = (typeof FUSE_PROGRAM_MECHANICS)[number];

export type FuseCommercialModel = (typeof FUSE_COMMERCIAL_MODELS)[number];

export type PartnerAppSpecTaxonomy = {
  partnerType: FusePartnerType;
  programMechanics: FuseProgramMechanic[];
  commercialModels: FuseCommercialModel[];
  ecosystems?: string[];
};

export type PartnerAppStandardObjectExtension = {
  objectUniversalIdentifier: string;
  fields?: FieldManifest[];
  views?: ViewManifest[];
  pageLayouts?: PageLayoutManifest[];
  navigationMenuItems?: NavigationMenuItemManifest[];
};

export type PartnerAppSeedData = SyncableEntityOptions & {
  targetObjectUniversalIdentifier: string;
  label: string;
  records: Array<Record<string, unknown>>;
};

export type PartnerAppInstallHooks = {
  preInstallLogicFunctionUniversalIdentifier?: string;
  postInstallLogicFunctionUniversalIdentifier?: string;
};

export type PartnerAppSpec = {
  application: ApplicationManifest;
  version: string;
  taxonomy: PartnerAppSpecTaxonomy;
  requiredApplicationVariables?: string[];
  applicationVariables?: ApplicationVariables;
  standardObjectExtensions: PartnerAppStandardObjectExtension[];
  customObjects: ObjectManifest[];
  relationFields: FieldManifest[];
  roles: RoleManifest[];
  views: ViewManifest[];
  pageLayouts: PageLayoutManifest[];
  navigationMenuItems: NavigationMenuItemManifest[];
  frontComponents: FrontComponentManifest[];
  logicFunctions: LogicFunctionManifest[];
  skills: SkillManifest[];
  agents: AgentManifest[];
  installHooks?: PartnerAppInstallHooks;
  seedData: PartnerAppSeedData[];
};

export type PartnerAppSpecValidationIssueCode =
  | 'INVALID_PARTNER_TYPE'
  | 'INVALID_PROGRAM_MECHANIC'
  | 'INVALID_COMMERCIAL_MODEL'
  | 'AXIS_CONFLATION'
  | 'DUPLICATE_UNIVERSAL_IDENTIFIER'
  | 'MISSING_REQUIRED_APPLICATION_VARIABLE';

export type PartnerAppSpecValidationIssue = {
  code: PartnerAppSpecValidationIssueCode;
  path: string;
  message: string;
};

export type PartnerAppSpecValidationResult = {
  valid: boolean;
  issues: PartnerAppSpecValidationIssue[];
};
