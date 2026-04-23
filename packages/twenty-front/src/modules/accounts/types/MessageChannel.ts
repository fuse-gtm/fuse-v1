import {
  type MessageChannelContactAutoCreationPolicy,
  type MessageChannelSyncStage,
  type MessageChannelSyncStatus,
  type MessageFolderImportPolicy,
} from 'twenty-shared/types';
import { type MessageChannelVisibility } from '~/generated/graphql';

export type MessageChannel = {
  id: string;
  handle: string;
  visibility: MessageChannelVisibility;
  type: string;
  isContactAutoCreationEnabled: boolean;
  contactAutoCreationPolicy: MessageChannelContactAutoCreationPolicy;
  messageFolderImportPolicy: MessageFolderImportPolicy;
  excludeNonProfessionalEmails: boolean;
  excludeGroupEmails: boolean;
  isSyncEnabled: boolean;
  syncStatus: MessageChannelSyncStatus;
  syncStage: MessageChannelSyncStage;
  syncStageStartedAt: string | null;
  connectedAccountId: string;
  createdAt: string;
  updatedAt: string;
  __typename: 'MessageChannel';
};

// Fuse compatibility — wave-2 consumers expect these enum-like types here.
// TODO(wave-3-cleanup): verify canonical source and migrate consumers.
export type MessageFolderImportPolicy = string;
export type MessageChannelSyncStage = string;
export type MessageChannelContactAutoCreationPolicy = string;
