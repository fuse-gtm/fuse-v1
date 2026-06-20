import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import {
  RESOURCE_STATUS_OPTIONS,
  RESOURCE_TYPE_OPTIONS,
} from 'src/constants/options';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const AGENCY_RESOURCE_NAME_SINGULAR = 'agencyResource';
export const AGENCY_RESOURCE_NAME_PLURAL = 'agencyResources';

export default defineObject({
  universalIdentifier: OBJECT_IDS.agencyResource,
  nameSingular: AGENCY_RESOURCE_NAME_SINGULAR,
  namePlural: AGENCY_RESOURCE_NAME_PLURAL,
  labelSingular: 'Agency Resource',
  labelPlural: 'Agency Resources',
  description: 'Enablement and go-to-market resource for agency partners.',
  icon: 'IconLibrary',
  labelIdentifierFieldMetadataUniversalIdentifier: FIELD_IDS.agencyResource.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.agencyResource.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconLibrary',
    },
    {
      universalIdentifier: FIELD_IDS.agencyResource.resourceType,
      type: FieldType.SELECT,
      name: 'resourceType',
      label: 'Resource Type',
      icon: 'IconFiles',
      options: RESOURCE_TYPE_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyResource.url,
      type: FieldType.TEXT,
      name: 'url',
      label: 'URL',
      icon: 'IconLink',
    },
    {
      universalIdentifier: FIELD_IDS.agencyResource.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      options: RESOURCE_STATUS_OPTIONS,
      defaultValue: 'draft',
    },
    {
      universalIdentifier: FIELD_IDS.agencyResource.partnerProfile,
      type: FieldType.RELATION,
      name: 'partnerProfile',
      label: 'Partner Profile',
      icon: 'IconAffiliate',
      relationTargetObjectMetadataUniversalIdentifier:
        CORE_OBJECT_IDS.partnerProfile,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProfile.resources,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'partnerProfileId',
      },
    },
  ],
});
