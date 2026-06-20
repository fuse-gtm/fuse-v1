import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import {
  REFERRAL_EVENT_STATUS_OPTIONS,
  REFERRAL_EVENT_TYPE_OPTIONS,
} from 'src/constants/options';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const AGENCY_REFERRAL_EVENT_NAME_SINGULAR = 'agencyReferralEvent';
export const AGENCY_REFERRAL_EVENT_NAME_PLURAL = 'agencyReferralEvents';

export default defineObject({
  universalIdentifier: OBJECT_IDS.agencyReferralEvent,
  nameSingular: AGENCY_REFERRAL_EVENT_NAME_SINGULAR,
  namePlural: AGENCY_REFERRAL_EVENT_NAME_PLURAL,
  labelSingular: 'Agency Referral Event',
  labelPlural: 'Agency Referral Events',
  description: 'Signed raw lead or sale event received for agency attribution.',
  icon: 'IconWebhook',
  labelIdentifierFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyReferralEvent.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconWebhook',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.eventId,
      type: FieldType.TEXT,
      name: 'eventId',
      label: 'Event ID',
      icon: 'IconHash',
      isUnique: true,
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.eventType,
      type: FieldType.SELECT,
      name: 'eventType',
      label: 'Event Type',
      icon: 'IconRoute',
      options: REFERRAL_EVENT_TYPE_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.signature,
      type: FieldType.TEXT,
      name: 'signature',
      label: 'Signature',
      icon: 'IconShieldCheck',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.customerId,
      type: FieldType.TEXT,
      name: 'customerId',
      label: 'Customer ID',
      icon: 'IconUser',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.invoiceId,
      type: FieldType.TEXT,
      name: 'invoiceId',
      label: 'Invoice ID',
      icon: 'IconReceipt',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.enrollmentId,
      type: FieldType.TEXT,
      name: 'enrollmentId',
      label: 'Enrollment ID',
      icon: 'IconClipboardCheck',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.amountCents,
      type: FieldType.NUMBER,
      name: 'amountCents',
      label: 'Amount Cents',
      icon: 'IconCoins',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      options: REFERRAL_EVENT_STATUS_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.occurredAt,
      type: FieldType.DATE_TIME,
      name: 'occurredAt',
      label: 'Occurred At',
      icon: 'IconCalendarEvent',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.payloadJson,
      type: FieldType.TEXT,
      name: 'payloadJson',
      label: 'Payload JSON',
      icon: 'IconBraces',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.partnerProfile,
      type: FieldType.RELATION,
      name: 'partnerProfile',
      label: 'Partner Profile',
      icon: 'IconAffiliate',
      relationTargetObjectMetadataUniversalIdentifier:
        CORE_OBJECT_IDS.partnerProfile,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProfile.referralEvents,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'partnerProfileId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.agencyGroup,
      type: FieldType.RELATION,
      name: 'agencyGroup',
      label: 'Agency Group',
      icon: 'IconUsersGroup',
      relationTargetObjectMetadataUniversalIdentifier: OBJECT_IDS.agencyGroup,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyGroup.referralEvents,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'agencyGroupId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralEvent.agencyAttribution,
      type: FieldType.RELATION,
      name: 'agencyAttribution',
      label: 'Agency Attribution',
      icon: 'IconTargetArrow',
      relationTargetObjectMetadataUniversalIdentifier:
        OBJECT_IDS.agencyAttribution,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyAttribution.referralEvents,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'agencyAttributionId',
      },
    },
  ],
});
