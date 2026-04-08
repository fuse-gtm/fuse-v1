// TODO: upstream cherry-pick stub - module not yet in fork
export type FlatObjectPermission = {
  id: string;
  universalIdentifier: string;
  applicationId: string;
  applicationUniversalIdentifier: string;
  workspaceId: string;
  roleId: string;
  roleUniversalIdentifier: string;
  objectMetadataId: string;
  objectMetadataUniversalIdentifier: string;
  canReadObjectRecords: boolean;
  canUpdateObjectRecords: boolean;
  canSoftDeleteObjectRecords: boolean;
  canDestroyObjectRecords: boolean;
  createdAt: string;
  updatedAt: string;
};
