import {
  defineObject,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';
import { TASK_STATUS_OPTIONS, TASK_TYPE_OPTIONS } from 'src/constants/options';
import { CORE_OBJECT_IDS } from 'src/constants/core-identifiers';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export const AGENCY_TASK_NAME_SINGULAR = 'agencyTask';
export const AGENCY_TASK_NAME_PLURAL = 'agencyTasks';

export default defineObject({
  universalIdentifier: OBJECT_IDS.agencyTask,
  nameSingular: AGENCY_TASK_NAME_SINGULAR,
  namePlural: AGENCY_TASK_NAME_PLURAL,
  labelSingular: 'Agency Task',
  labelPlural: 'Agency Tasks',
  description: 'Agency partner operator task for review and enablement work.',
  icon: 'IconCheckbox',
  labelIdentifierFieldMetadataUniversalIdentifier: FIELD_IDS.agencyTask.name,
  fields: [
    {
      universalIdentifier: FIELD_IDS.agencyTask.name,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconCheckbox',
    },
    {
      universalIdentifier: FIELD_IDS.agencyTask.taskType,
      type: FieldType.SELECT,
      name: 'taskType',
      label: 'Task Type',
      icon: 'IconCategory',
      options: TASK_TYPE_OPTIONS,
    },
    {
      universalIdentifier: FIELD_IDS.agencyTask.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgressCheck',
      options: TASK_STATUS_OPTIONS,
      defaultValue: "'OPEN'",
    },
    {
      universalIdentifier: FIELD_IDS.agencyTask.dueAt,
      type: FieldType.DATE_TIME,
      name: 'dueAt',
      label: 'Due At',
      icon: 'IconCalendarDue',
    },
    {
      universalIdentifier: FIELD_IDS.agencyTask.partnerProfile,
      type: FieldType.RELATION,
      name: 'partnerProfile',
      label: 'Partner Profile',
      icon: 'IconAffiliate',
      relationTargetObjectMetadataUniversalIdentifier:
        CORE_OBJECT_IDS.partnerProfile,
      relationTargetFieldMetadataUniversalIdentifier:
        FIELD_IDS.partnerProfile.agencyTasks,
      isNullable: true,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'partnerProfileId',
      },
    },
  ],
});
