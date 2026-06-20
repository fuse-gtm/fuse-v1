import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT,
} from 'twenty-sdk/define';
import {
  COMMERCIAL_MODEL_OPTIONS,
  PARTNER_STATUS_OPTIONS,
  PARTNER_SUBTYPE_OPTIONS,
  PARTNER_TYPE_OPTIONS,
  PROGRAM_MECHANIC_OPTIONS,
} from 'src/constants/options';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const PARTNER_PROFILE_NAME_SINGULAR = 'partnerProfile';
export const PARTNER_PROFILE_NAME_PLURAL = 'partnerProfiles';

export default defineObject({
  universalIdentifier: OBJECT_IDS.partnerProfile,
  nameSingular: PARTNER_PROFILE_NAME_SINGULAR,
  namePlural: PARTNER_PROFILE_NAME_PLURAL,
  labelSingular: 'Partner Profile',
  labelPlural: 'Partner Profiles',
  description:
    'Shared Fuse partner operating record connected to a standard company.',
  icon: 'IconAffiliate',
  labelIdentifierFieldMetadataUniversalIdentifier:
    FIELD_IDS.partnerProfile.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.partnerProfile.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconBuilding',
    },
    {
      universalIdentifier: FIELD_IDS.partnerProfile.primaryDomain,
      type: FieldType.TEXT,
      name: 'primaryDomain',
      label: 'Primary Domain',
      icon: 'IconWorldWww',
      isUnique: true,
    },
    {
      universalIdentifier: FIELD_IDS.partnerProfile.partnerType,
      type: FieldType.SELECT,
      name: 'partnerType',
      label: 'Partner Type',
      description:
        'Axis 1 partner type. Referral and affiliate do not belong here.',
      icon: 'IconCategory',
      options: PARTNER_TYPE_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.partnerProfile.partnerSubtypes,
      type: FieldType.MULTI_SELECT,
      name: 'partnerSubtypes',
      label: 'Partner Subtypes',
      description: 'Second-level vocabulary for the selected partner type.',
      icon: 'IconTags',
      options: PARTNER_SUBTYPE_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.partnerProfile.programMechanics,
      type: FieldType.MULTI_SELECT,
      name: 'programMechanics',
      label: 'Program Mechanics',
      description: 'Axis 2 mechanics the partner participates in.',
      icon: 'IconRoute',
      options: PROGRAM_MECHANIC_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.partnerProfile.commercialModels,
      type: FieldType.MULTI_SELECT,
      name: 'commercialModels',
      label: 'Commercial Models',
      description:
        'Value-flow models independent from partner type and mechanic.',
      icon: 'IconCoins',
      options: COMMERCIAL_MODEL_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.partnerProfile.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      options: PARTNER_STATUS_OPTIONS,
      defaultValue: "'CANDIDATE'",
    },
    {
      universalIdentifier: FIELD_IDS.partnerProfile.company,
      type: FieldType.RELATION,
      name: 'company',
      label: 'Company',
      description: 'Standard company record for this partner.',
      icon: 'IconBuilding',
      relationTargetObjectMetadataUniversalIdentifier:
        STANDARD_OBJECT.company.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.company.partnerProfiles,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'companyId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.partnerProfile.primaryContact,
      type: FieldType.RELATION,
      name: 'primaryContact',
      label: 'Primary Contact',
      description: 'Primary partner contact on the standard person object.',
      icon: 'IconUser',
      relationTargetObjectMetadataUniversalIdentifier:
        STANDARD_OBJECT.person.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.person.partnerProfiles,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'primaryContactId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.partnerProfile.enrollments,
      type: FieldType.RELATION,
      name: 'enrollments',
      label: 'Enrollments',
      description: 'Program enrollments for this partner profile.',
      icon: 'IconClipboardCheck',
      relationTargetObjectMetadataUniversalIdentifier:
        OBJECT_IDS.partnerEnrollment,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerEnrollment.partnerProfile,
      universalSettings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    {
      universalIdentifier: FIELD_IDS.partnerProfile.sourcedOpportunities,
      type: FieldType.RELATION,
      name: 'sourcedOpportunities',
      label: 'Sourced Opportunities',
      description:
        'Opportunities sourced or influenced by this partner profile.',
      icon: 'IconTargetArrow',
      relationTargetObjectMetadataUniversalIdentifier:
        STANDARD_OBJECT.opportunity.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.opportunity.sourcedPartnerProfile,
      universalSettings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
  ],
});
