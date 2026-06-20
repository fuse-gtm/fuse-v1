import {
  defineView,
  ViewFilterOperand,
  ViewKey,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';
import {
  FIELD_IDS,
  OBJECT_IDS,
  VIEW_FIELD_IDS,
  VIEW_IDS,
  VIEW_SORT_IDS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW_IDS.activeEnrollments,
  name: 'Active Enrollments',
  objectUniversalIdentifier: OBJECT_IDS.partnerEnrollment,
  type: ViewType.TABLE,
  icon: 'IconClipboardCheck',
  key: ViewKey.INDEX,
  position: 0,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[4],
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerEnrollment.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[5],
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerEnrollment.status,
      position: 1,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[6],
      fieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerEnrollment.partnerProgram,
      position: 2,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[7],
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerEnrollment.startedAt,
      position: 3,
      isVisible: true,
      size: 140,
    },
  ],
  filters: [
    {
      universalIdentifier: '82f3a0bb-f853-4fa4-90b0-3e22404e2d53',
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerEnrollment.status,
      operand: ViewFilterOperand.IS,
      value: 'ACTIVE',
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.activeEnrollments,
      fieldMetadataUniversalIdentifier: FIELD_IDS.partnerEnrollment.startedAt,
      direction: ViewSortDirection.DESC,
    },
  ],
});
