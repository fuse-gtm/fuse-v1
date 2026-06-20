import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import { ENROLLMENT_STATUS_OPTIONS } from 'src/constants/options';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const PARTNER_ENROLLMENT_NAME_SINGULAR = 'partnerEnrollment';
export const PARTNER_ENROLLMENT_NAME_PLURAL = 'partnerEnrollments';

export default defineObject({
  universalIdentifier: OBJECT_IDS.partnerEnrollment,
  nameSingular: PARTNER_ENROLLMENT_NAME_SINGULAR,
  namePlural: PARTNER_ENROLLMENT_NAME_PLURAL,
  labelSingular: 'Partner Enrollment',
  labelPlural: 'Partner Enrollments',
  description: 'Enrollment of a partner profile in a partner program.',
  icon: 'IconClipboardCheck',
  labelIdentifierFieldMetadataUniversalIdentifier:
    FIELD_IDS.partnerEnrollment.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.partnerEnrollment.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconClipboardCheck',
    },
    {
      universalIdentifier: FIELD_IDS.partnerEnrollment.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      options: ENROLLMENT_STATUS_OPTIONS,
      defaultValue: "'ACTIVE'",
    },
    {
      universalIdentifier: FIELD_IDS.partnerEnrollment.startedAt,
      type: FieldType.DATE,
      name: 'startedAt',
      label: 'Started At',
      icon: 'IconCalendar',
    },
    {
      universalIdentifier: FIELD_IDS.partnerEnrollment.notes,
      type: FieldType.TEXT,
      name: 'notes',
      label: 'Notes',
      description: 'Operator notes for this enrollment.',
      icon: 'IconNotes',
    },
    {
      universalIdentifier: FIELD_IDS.partnerEnrollment.partnerProfile,
      type: FieldType.RELATION,
      name: 'partnerProfile',
      label: 'Partner Profile',
      description: 'Partner profile attached to this enrollment.',
      icon: 'IconAffiliate',
      relationTargetObjectMetadataUniversalIdentifier:
        OBJECT_IDS.partnerProfile,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProfile.enrollments,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'partnerProfileId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.partnerEnrollment.partnerProgram,
      type: FieldType.RELATION,
      name: 'partnerProgram',
      label: 'Partner Program',
      description: 'Program attached to this enrollment.',
      icon: 'IconRoute',
      relationTargetObjectMetadataUniversalIdentifier:
        OBJECT_IDS.partnerProgram,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProgram.enrollments,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'partnerProgramId',
      },
    },
  ],
});
