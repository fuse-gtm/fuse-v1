import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import {
  AGENCY_GROUP_STATUS_OPTIONS,
  AGENCY_GROUP_TIER_OPTIONS,
} from 'src/constants/options';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const AGENCY_GROUP_NAME_SINGULAR = 'agencyGroup';
export const AGENCY_GROUP_NAME_PLURAL = 'agencyGroups';

export default defineObject({
  universalIdentifier: OBJECT_IDS.agencyGroup,
  nameSingular: AGENCY_GROUP_NAME_SINGULAR,
  namePlural: AGENCY_GROUP_NAME_PLURAL,
  labelSingular: 'Agency Group',
  labelPlural: 'Agency Groups',
  description: 'Agency cohort, tier, or group created during approval.',
  icon: 'IconUsersGroup',
  labelIdentifierFieldMetadataUniversalIdentifier: FIELD_IDS.agencyGroup.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.agencyGroup.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconUsersGroup',
    },
    {
      universalIdentifier: FIELD_IDS.agencyGroup.tier,
      type: FieldType.SELECT,
      name: 'tier',
      label: 'Tier',
      icon: 'IconAward',
      options: AGENCY_GROUP_TIER_OPTIONS,
      defaultValue: "'STANDARD'",
    },
    {
      universalIdentifier: FIELD_IDS.agencyGroup.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      options: AGENCY_GROUP_STATUS_OPTIONS,
      defaultValue: "'ACTIVE'",
    },
    {
      universalIdentifier: FIELD_IDS.agencyGroup.partnerProfile,
      type: FieldType.RELATION,
      name: 'partnerProfile',
      label: 'Partner Profile',
      icon: 'IconAffiliate',
      relationTargetObjectMetadataUniversalIdentifier:
        CORE_OBJECT_IDS.partnerProfile,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProfile.agencyGroups,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'partnerProfileId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyGroup.applications,
      type: FieldType.RELATION,
      name: 'applications',
      label: 'Applications',
      icon: 'IconClipboardText',
      relationTargetObjectMetadataUniversalIdentifier:
        OBJECT_IDS.agencyApplication,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyApplication.agencyGroup,
      universalSettings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyGroup.reviewEvents,
      type: FieldType.RELATION,
      name: 'reviewEvents',
      label: 'Review Events',
      icon: 'IconTimelineEvent',
      relationTargetObjectMetadataUniversalIdentifier:
        OBJECT_IDS.agencyReviewEvent,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyReviewEvent.agencyGroup,
      universalSettings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyGroup.referralEvents,
      type: FieldType.RELATION,
      name: 'referralEvents',
      label: 'Referral Events',
      icon: 'IconWebhook',
      relationTargetObjectMetadataUniversalIdentifier:
        OBJECT_IDS.agencyReferralEvent,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyReferralEvent.agencyGroup,
      universalSettings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyGroup.referralRollups,
      type: FieldType.RELATION,
      name: 'referralRollups',
      label: 'Referral Rollups',
      icon: 'IconChartBar',
      relationTargetObjectMetadataUniversalIdentifier:
        OBJECT_IDS.agencyReferralRollup,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyReferralRollup.agencyGroup,
      universalSettings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },
  ],
});
