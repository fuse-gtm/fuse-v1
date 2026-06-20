import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import { AGENCY_REVIEW_ACTION_OPTIONS } from 'src/constants/options';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const AGENCY_REVIEW_EVENT_NAME_SINGULAR = 'agencyReviewEvent';
export const AGENCY_REVIEW_EVENT_NAME_PLURAL = 'agencyReviewEvents';

export default defineObject({
  universalIdentifier: OBJECT_IDS.agencyReviewEvent,
  nameSingular: AGENCY_REVIEW_EVENT_NAME_SINGULAR,
  namePlural: AGENCY_REVIEW_EVENT_NAME_PLURAL,
  labelSingular: 'Agency Review Event',
  labelPlural: 'Agency Review Events',
  description: 'Auditable application review event and evidence snapshot.',
  icon: 'IconTimelineEvent',
  labelIdentifierFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyReviewEvent.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.agencyReviewEvent.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconTimelineEvent',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReviewEvent.action,
      type: FieldType.SELECT,
      name: 'action',
      label: 'Action',
      icon: 'IconProgressCheck',
      options: AGENCY_REVIEW_ACTION_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyReviewEvent.reason,
      type: FieldType.TEXT,
      name: 'reason',
      label: 'Reason',
      icon: 'IconNotes',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReviewEvent.evidenceJson,
      type: FieldType.TEXT,
      name: 'evidenceJson',
      label: 'Evidence JSON',
      icon: 'IconBraces',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReviewEvent.occurredAt,
      type: FieldType.DATE_TIME,
      name: 'occurredAt',
      label: 'Occurred At',
      icon: 'IconCalendarEvent',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReviewEvent.application,
      type: FieldType.RELATION,
      name: 'application',
      label: 'Application',
      icon: 'IconClipboardText',
      relationTargetObjectMetadataUniversalIdentifier:
        OBJECT_IDS.agencyApplication,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyApplication.reviewEvents,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'applicationId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyReviewEvent.partnerProfile,
      type: FieldType.RELATION,
      name: 'partnerProfile',
      label: 'Partner Profile',
      icon: 'IconAffiliate',
      relationTargetObjectMetadataUniversalIdentifier:
        CORE_OBJECT_IDS.partnerProfile,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProfile.reviewEvents,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'partnerProfileId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyReviewEvent.agencyGroup,
      type: FieldType.RELATION,
      name: 'agencyGroup',
      label: 'Agency Group',
      icon: 'IconUsersGroup',
      relationTargetObjectMetadataUniversalIdentifier: OBJECT_IDS.agencyGroup,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyGroup.reviewEvents,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'agencyGroupId',
      },
    },
  ],
});
