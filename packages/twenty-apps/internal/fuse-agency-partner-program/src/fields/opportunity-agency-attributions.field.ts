import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT,
} from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: FIELD_IDS.opportunity.agencyAttributions,
  objectUniversalIdentifier: STANDARD_OBJECT.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'agencyAttributions',
  label: 'Agency Attributions',
  description: 'Agency attribution records connected to this opportunity.',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECT_IDS.agencyAttribution,
  relationTargetFieldMetadataUniversalIdentifier:
    FIELD_IDS.agencyAttribution.opportunity,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
