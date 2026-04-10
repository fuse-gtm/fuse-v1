import { type SyncableEntityOptions } from './syncableEntityOptionsType';
import {
  type GridPosition,
  type PageLayoutTabLayoutMode,
  type PageLayoutWidgetConditionalDisplay,
  type PageLayoutWidgetUniversalConfiguration,
} from '../types/index';

export type PageLayoutWidgetManifest = SyncableEntityOptions & {
  title: string;
  type: string;
  objectUniversalIdentifier?: string;
  conditionalDisplay?: PageLayoutWidgetConditionalDisplay;
  gridPosition?: GridPosition;
  configuration: PageLayoutWidgetUniversalConfiguration;
};

export type PageLayoutTabManifest = SyncableEntityOptions & {
  title: string;
  position: number;
  icon?: string;
  layoutMode?: PageLayoutTabLayoutMode;
  widgets?: PageLayoutWidgetManifest[];
};

export type PageLayoutManifest = SyncableEntityOptions & {
  name: string;
  type?: string;
  objectUniversalIdentifier?: string;
  defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier?: string;
  tabs?: PageLayoutTabManifest[];
};
