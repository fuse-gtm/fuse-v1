import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import {
  AGENCY_SERVICE_BUCKET_OPTIONS,
  CAPACITY_BAND_OPTIONS,
  PLATFORM_FOCUS_OPTIONS,
} from 'src/constants/options';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const AGENCY_SERVICE_CAPABILITY_NAME_SINGULAR =
  'agencyServiceCapability';
export const AGENCY_SERVICE_CAPABILITY_NAME_PLURAL =
  'agencyServiceCapabilities';

export default defineObject({
  universalIdentifier: OBJECT_IDS.agencyServiceCapability,
  nameSingular: AGENCY_SERVICE_CAPABILITY_NAME_SINGULAR,
  namePlural: AGENCY_SERVICE_CAPABILITY_NAME_PLURAL,
  labelSingular: 'Agency Service Capability',
  labelPlural: 'Agency Service Capabilities',
  description: 'Agency service category, platform focus, and capacity detail.',
  icon: 'IconBriefcase',
  labelIdentifierFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyServiceCapability.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.agencyServiceCapability.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconBriefcase',
    },
    {
      universalIdentifier: FIELD_IDS.agencyServiceCapability.serviceBucket,
      type: FieldType.SELECT,
      name: 'serviceBucket',
      label: 'Service Bucket',
      icon: 'IconCategory',
      options: AGENCY_SERVICE_BUCKET_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyServiceCapability.platformFocus,
      type: FieldType.SELECT,
      name: 'platformFocus',
      label: 'Platform Focus',
      icon: 'IconStack2',
      options: PLATFORM_FOCUS_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyServiceCapability.certifications,
      type: FieldType.TEXT,
      name: 'certifications',
      label: 'Certifications',
      icon: 'IconCertificate',
    },
    {
      universalIdentifier: FIELD_IDS.agencyServiceCapability.capacityBand,
      type: FieldType.SELECT,
      name: 'capacityBand',
      label: 'Capacity Band',
      icon: 'IconUsersGroup',
      options: CAPACITY_BAND_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyServiceCapability.partnerProfile,
      type: FieldType.RELATION,
      name: 'partnerProfile',
      label: 'Partner Profile',
      icon: 'IconAffiliate',
      relationTargetObjectMetadataUniversalIdentifier:
        CORE_OBJECT_IDS.partnerProfile,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProfile.serviceCapabilities,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'partnerProfileId',
      },
    },
  ],
});
