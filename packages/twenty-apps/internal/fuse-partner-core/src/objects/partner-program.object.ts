import { defineObject, FieldType, RelationType } from 'twenty-sdk/define';
import {
  COMMERCIAL_MODEL_OPTIONS,
  PROGRAM_MECHANIC_OPTIONS,
} from 'src/constants/options';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const PARTNER_PROGRAM_NAME_SINGULAR = 'partnerProgram';
export const PARTNER_PROGRAM_NAME_PLURAL = 'partnerPrograms';

export default defineObject({
  universalIdentifier: OBJECT_IDS.partnerProgram,
  nameSingular: PARTNER_PROGRAM_NAME_SINGULAR,
  namePlural: PARTNER_PROGRAM_NAME_PLURAL,
  labelSingular: 'Partner Program',
  labelPlural: 'Partner Programs',
  description:
    'Shared program definition that separates mechanics, ecosystem, and value model.',
  icon: 'IconRoute',
  labelIdentifierFieldMetadataUniversalIdentifier:
    FIELD_IDS.partnerProgram.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.partnerProgram.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconRoute',
    },
    {
      universalIdentifier: FIELD_IDS.partnerProgram.mechanic,
      type: FieldType.SELECT,
      name: 'programMechanic',
      label: 'Program Mechanic',
      description:
        'Axis 2 program mechanic. This is separate from Axis 1 partner type.',
      icon: 'IconArrowsSplit',
      options: PROGRAM_MECHANIC_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.partnerProgram.ecosystem,
      type: FieldType.TEXT,
      name: 'ecosystem',
      label: 'Ecosystem',
      description: 'Axis 3 ecosystem or vendor context for the program.',
      icon: 'IconTopologyStar3',
    },
    {
      universalIdentifier: FIELD_IDS.partnerProgram.brand,
      type: FieldType.TEXT,
      name: 'programBrandName',
      label: 'Program Brand Name',
      description: 'External or vendor-facing program label, if different.',
      icon: 'IconBadge',
    },
    {
      universalIdentifier: FIELD_IDS.partnerProgram.commercialModels,
      type: FieldType.MULTI_SELECT,
      name: 'commercialModels',
      label: 'Commercial Models',
      description: 'Commercial value models available in this program.',
      icon: 'IconCoins',
      options: COMMERCIAL_MODEL_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.partnerProgram.tier,
      type: FieldType.TEXT,
      name: 'tier',
      label: 'Tier',
      description:
        'Optional partner tier or badge associated with the program.',
      icon: 'IconAward',
    },
    {
      universalIdentifier: FIELD_IDS.partnerProgram.enrollments,
      type: FieldType.RELATION,
      name: 'enrollments',
      label: 'Enrollments',
      description: 'Partner enrollments in this program.',
      icon: 'IconClipboardCheck',
      relationTargetObjectMetadataUniversalIdentifier:
        OBJECT_IDS.partnerEnrollment,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerEnrollment.partnerProgram,
      universalSettings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
  ],
});
