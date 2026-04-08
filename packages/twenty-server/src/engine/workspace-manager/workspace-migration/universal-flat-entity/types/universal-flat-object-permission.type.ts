// TODO: upstream cherry-pick stub - module not yet in fork
export type UniversalFlatObjectPermission = {
  universalIdentifier: string;
  applicationUniversalIdentifier: string;
  roleUniversalIdentifier: string;
  objectMetadataUniversalIdentifier: string;
  canReadObjectRecords: boolean;
  canUpdateObjectRecords: boolean;
  canSoftDeleteObjectRecords: boolean;
  canDestroyObjectRecords: boolean;
  createdAt: string;
  updatedAt: string;
};
