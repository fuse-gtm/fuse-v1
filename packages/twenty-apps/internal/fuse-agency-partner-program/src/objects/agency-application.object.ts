import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT,
} from 'twenty-sdk/define';
import {
  AGENCY_APPLICATION_STATUS_OPTIONS,
  AGENCY_SERVICE_BUCKET_OPTIONS,
  MONTHLY_LEAD_VOLUME_OPTIONS,
} from 'src/constants/options';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const AGENCY_APPLICATION_NAME_SINGULAR = 'agencyApplication';
export const AGENCY_APPLICATION_NAME_PLURAL = 'agencyApplications';

export default defineObject({
  universalIdentifier: OBJECT_IDS.agencyApplication,
  nameSingular: AGENCY_APPLICATION_NAME_SINGULAR,
  namePlural: AGENCY_APPLICATION_NAME_PLURAL,
  labelSingular: 'Agency Application',
  labelPlural: 'Agency Applications',
  description: 'Agency partner application intake and review record.',
  icon: 'IconClipboardText',
  labelIdentifierFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyApplication.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.agencyApplication.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconClipboardText',
    },
    {
      universalIdentifier: FIELD_IDS.agencyApplication.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      options: AGENCY_APPLICATION_STATUS_OPTIONS,
      defaultValue: 'submitted',
    },
    {
      universalIdentifier: FIELD_IDS.agencyApplication.submittedAt,
      type: FieldType.DATE_TIME,
      name: 'submittedAt',
      label: 'Submitted At',
      icon: 'IconCalendar',
    },
    {
      universalIdentifier: FIELD_IDS.agencyApplication.website,
      type: FieldType.TEXT,
      name: 'website',
      label: 'Website',
      icon: 'IconWorldWww',
    },
    {
      universalIdentifier: FIELD_IDS.agencyApplication.serviceBuckets,
      type: FieldType.MULTI_SELECT,
      name: 'serviceBuckets',
      label: 'Service Buckets',
      description: 'Agency functional categories from the Fuse taxonomy.',
      icon: 'IconTags',
      options: AGENCY_SERVICE_BUCKET_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyApplication.monthlyLeadVolumeBand,
      type: FieldType.SELECT,
      name: 'monthlyLeadVolumeBand',
      label: 'Monthly Lead Volume',
      icon: 'IconChartBar',
      options: MONTHLY_LEAD_VOLUME_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyApplication.reviewDecisionReason,
      type: FieldType.TEXT,
      name: 'reviewDecisionReason',
      label: 'Review Decision Reason',
      icon: 'IconNotes',
    },
    {
      universalIdentifier: FIELD_IDS.agencyApplication.partnerProfile,
      type: FieldType.RELATION,
      name: 'partnerProfile',
      label: 'Partner Profile',
      icon: 'IconAffiliate',
      relationTargetObjectMetadataUniversalIdentifier:
        CORE_OBJECT_IDS.partnerProfile,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProfile.agencyApplications,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'partnerProfileId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyApplication.company,
      type: FieldType.RELATION,
      name: 'company',
      label: 'Company',
      icon: 'IconBuilding',
      relationTargetObjectMetadataUniversalIdentifier:
        STANDARD_OBJECT.company.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.company.agencyApplications,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'companyId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyApplication.person,
      type: FieldType.RELATION,
      name: 'person',
      label: 'Applicant',
      icon: 'IconUser',
      relationTargetObjectMetadataUniversalIdentifier:
        STANDARD_OBJECT.person.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.person.agencyApplications,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'personId',
      },
    },
  ],
});
