import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT,
} from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.company.agencyApplications,
  objectUniversalIdentifier: STANDARD_OBJECT.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'agencyApplications',
  label: 'Agency Applications',
  description: 'Agency partner applications connected to this company.',
  icon: 'IconClipboardText',
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECT_IDS.agencyApplication,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyApplication.company,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
