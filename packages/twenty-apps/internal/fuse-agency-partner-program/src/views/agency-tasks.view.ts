import {
  defineView,
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
  universalIdentifier: VIEW_IDS.tasks,
  name: 'Tasks',
  objectUniversalIdentifier: OBJECT_IDS.agencyTask,
  type: ViewType.TABLE,
  icon: 'IconCheckbox',
  key: ViewKey.INDEX,
  position: 6,
  fields: [
    {
      universalIdentifier: VIEW_FIELD_IDS[23],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyTask.name,
      position: 0,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[24],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyTask.status,
      position: 1,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: VIEW_FIELD_IDS[25],
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyTask.dueAt,
      position: 2,
      isVisible: true,
      size: 180,
    },
  ],
  sorts: [
    {
      universalIdentifier: VIEW_SORT_IDS.tasks,
      fieldMetadataUniversalIdentifier: FIELD_IDS.agencyTask.dueAt,
      direction: ViewSortDirection.ASC,
    },
  ],
});
