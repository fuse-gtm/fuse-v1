import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT,
} from 'twenty-sdk/define';
import {
  ATTRIBUTION_STATUS_OPTIONS,
  ATTRIBUTION_TYPE_OPTIONS,
} from 'src/constants/options';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const AGENCY_ATTRIBUTION_NAME_SINGULAR = 'agencyAttribution';
export const AGENCY_ATTRIBUTION_NAME_PLURAL = 'agencyAttributions';

export default defineObject({
  universalIdentifier: OBJECT_IDS.agencyAttribution,
  nameSingular: AGENCY_ATTRIBUTION_NAME_SINGULAR,
  namePlural: AGENCY_ATTRIBUTION_NAME_PLURAL,
  labelSingular: 'Agency Attribution',
  labelPlural: 'Agency Attributions',
  description: 'Agency-sourced or influenced opportunity attribution.',
  icon: 'IconTargetArrow',
  labelIdentifierFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyAttribution.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.agencyAttribution.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconTargetArrow',
    },
    {
      universalIdentifier: FIELD_IDS.agencyAttribution.attributionType,
      type: FieldType.SELECT,
      name: 'attributionType',
      label: 'Attribution Type',
      icon: 'IconRoute',
      options: ATTRIBUTION_TYPE_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyAttribution.sourceEventId,
      type: FieldType.TEXT,
      name: 'sourceEventId',
      label: 'Source Event ID',
      icon: 'IconHash',
    },
    {
      universalIdentifier: FIELD_IDS.agencyAttribution.amountCents,
      type: FieldType.NUMBER,
      name: 'amountCents',
      label: 'Amount Cents',
      icon: 'IconCoins',
    },
    {
      universalIdentifier: FIELD_IDS.agencyAttribution.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      options: ATTRIBUTION_STATUS_OPTIONS,
      defaultValue: 'pending',
    },
    {
      universalIdentifier: FIELD_IDS.agencyAttribution.partnerProfile,
      type: FieldType.RELATION,
      name: 'partnerProfile',
      label: 'Partner Profile',
      icon: 'IconAffiliate',
      relationTargetObjectMetadataUniversalIdentifier:
        CORE_OBJECT_IDS.partnerProfile,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProfile.attributions,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'partnerProfileId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyAttribution.opportunity,
      type: FieldType.RELATION,
      name: 'opportunity',
      label: 'Opportunity',
      icon: 'IconTargetArrow',
      relationTargetObjectMetadataUniversalIdentifier:
        STANDARD_OBJECT.opportunity.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.opportunity.agencyAttributions,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'opportunityId',
      },
    },
  ],
});
