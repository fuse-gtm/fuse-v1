import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import {
  REFERRAL_ROLLUP_REPAIR_STATUS_OPTIONS,
  REFERRAL_ROLLUP_SCOPE_OPTIONS,
} from 'src/constants/options';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const AGENCY_REFERRAL_ROLLUP_NAME_SINGULAR = 'agencyReferralRollup';
export const AGENCY_REFERRAL_ROLLUP_NAME_PLURAL = 'agencyReferralRollups';

export default defineObject({
  universalIdentifier: OBJECT_IDS.agencyReferralRollup,
  nameSingular: AGENCY_REFERRAL_ROLLUP_NAME_SINGULAR,
  namePlural: AGENCY_REFERRAL_ROLLUP_NAME_PLURAL,
  labelSingular: 'Agency Referral Rollup',
  labelPlural: 'Agency Referral Rollups',
  description: 'Operational lead, sale, and revenue rollup for agency attribution.',
  icon: 'IconChartBar',
  labelIdentifierFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyReferralRollup.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.agencyReferralRollup.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconChartBar',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralRollup.scopeType,
      type: FieldType.SELECT,
      name: 'scopeType',
      label: 'Scope Type',
      icon: 'IconCategory',
      options: REFERRAL_ROLLUP_SCOPE_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralRollup.scopeId,
      type: FieldType.TEXT,
      name: 'scopeId',
      label: 'Scope ID',
      icon: 'IconHash',
      isUnique: true,
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralRollup.leadCount,
      type: FieldType.NUMBER,
      name: 'leadCount',
      label: 'Lead Count',
      icon: 'IconUsers',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralRollup.saleCount,
      type: FieldType.NUMBER,
      name: 'saleCount',
      label: 'Sale Count',
      icon: 'IconReceipt',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralRollup.revenueCents,
      type: FieldType.NUMBER,
      name: 'revenueCents',
      label: 'Revenue Cents',
      icon: 'IconCoins',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralRollup.lastEventAt,
      type: FieldType.DATE_TIME,
      name: 'lastEventAt',
      label: 'Last Event At',
      icon: 'IconCalendarEvent',
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralRollup.repairStatus,
      type: FieldType.SELECT,
      name: 'repairStatus',
      label: 'Repair Status',
      icon: 'IconRefresh',
      options: REFERRAL_ROLLUP_REPAIR_STATUS_OPTIONS,
      defaultValue: "'FRESH'",
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralRollup.partnerProfile,
      type: FieldType.RELATION,
      name: 'partnerProfile',
      label: 'Partner Profile',
      icon: 'IconAffiliate',
      relationTargetObjectMetadataUniversalIdentifier:
        CORE_OBJECT_IDS.partnerProfile,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProfile.referralRollups,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'partnerProfileId',
      },
    },
    {
      universalIdentifier: FIELD_IDS.agencyReferralRollup.agencyGroup,
      type: FieldType.RELATION,
      name: 'agencyGroup',
      label: 'Agency Group',
      icon: 'IconUsersGroup',
      relationTargetObjectMetadataUniversalIdentifier: OBJECT_IDS.agencyGroup,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.agencyGroup.referralRollups,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'agencyGroupId',
      },
    },
  ],
});
