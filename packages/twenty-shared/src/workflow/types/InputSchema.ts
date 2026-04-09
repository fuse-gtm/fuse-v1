import { type LeafType, type NodeType } from '@/workflow/index';
import { type FieldMetadataType } from '@/types/index';

export type InputSchemaPropertyType = LeafType | NodeType | FieldMetadataType;

export type InputSchemaProperty = {
  type: InputSchemaPropertyType;
  enum?: string[];
  items?: InputSchemaProperty;
  properties?: Properties;
};

type Properties = {
  [name: string]: InputSchemaProperty;
};

export type InputSchema = InputSchemaProperty[];
