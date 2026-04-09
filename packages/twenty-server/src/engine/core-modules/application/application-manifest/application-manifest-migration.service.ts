import { Injectable, Logger } from '@nestjs/common';

import { type Manifest, type RoleManifest } from 'twenty-shared/application';
import { ALL_METADATA_NAME } from 'twenty-shared/metadata';
import { isDefined } from 'twenty-shared/utils';

import { buildFromToAllUniversalFlatEntityMaps } from 'src/engine/core-modules/application/application-manifest/utils/build-from-to-all-universal-flat-entity-maps.util';
import { computeApplicationManifestAllUniversalFlatEntityMaps } from 'src/engine/core-modules/application/application-manifest/utils/compute-application-manifest-all-universal-flat-entity-maps.util';
import { getApplicationSubAllFlatEntityMaps } from 'src/engine/core-modules/application/application-manifest/utils/get-application-sub-all-flat-entity-maps.util';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from 'src/engine/core-modules/application/application.exception';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { findFlatEntityByUniversalIdentifier } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util';
import { getMetadataFlatEntityMapsKey } from 'src/engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util';
import { FieldPermissionService } from 'src/engine/metadata-modules/object-permission/field-permission/field-permission.service';
import { ObjectPermissionService } from 'src/engine/metadata-modules/object-permission/object-permission.service';
import { PermissionFlagService } from 'src/engine/metadata-modules/permission-flag/permission-flag.service';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { TWENTY_STANDARD_APPLICATION } from 'src/engine/workspace-manager/twenty-standard-application/constants/twenty-standard-applications';
import { WorkspaceMigrationBuilderException } from 'src/engine/workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception';
import { WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';
import { WorkspaceMigration } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/types/workspace-migration.type';

@Injectable()
export class ApplicationManifestMigrationService {
  private readonly logger = new Logger(
    ApplicationManifestMigrationService.name,
  );

  constructor(
    private readonly workspaceCacheService: WorkspaceCacheService,
    private readonly workspaceMigrationValidateBuildAndRunService: WorkspaceMigrationValidateBuildAndRunService,
    private readonly applicationService: ApplicationService,
    private readonly objectPermissionService: ObjectPermissionService,
    private readonly fieldPermissionService: FieldPermissionService,
    private readonly permissionFlagService: PermissionFlagService,
  ) {}

  async syncPreInstallLogicFunctionFromManifest({
    manifest,
    workspaceId,
    ownerFlatApplication,
  }: {
    manifest: Manifest;
    workspaceId: string;
    ownerFlatApplication: FlatApplication;
  }): Promise<void> {
    const preInstallLogicFunction =
      manifest.application.preInstallLogicFunction;

    if (!isDefined(preInstallLogicFunction)) {
      return;
    }

    const preInstallLogicFunctionManifest = manifest.logicFunctions.find(
      (logicFunction) =>
        logicFunction.universalIdentifier ===
        preInstallLogicFunction.universalIdentifier,
    );

    if (!isDefined(preInstallLogicFunctionManifest)) {
      throw new ApplicationException(
        `Pre-install logic function "${preInstallLogicFunction.universalIdentifier}" is declared on the application manifest but not present in manifest.logicFunctions`,
        ApplicationExceptionCode.ENTITY_NOT_FOUND,
      );
    }

    const defaultRoleManifest = manifest.roles.find(
      (role) =>
        role.universalIdentifier ===
        manifest.application.defaultRoleUniversalIdentifier,
    );

    // Pared-down manifest: only the pre-install logic function, every other
    // entity array intentionally empty. Combined with
    // inferDeletionFromMissingEntities: false below, this produces a purely
    // additive migration that registers the pre-install logic function without
    // touching any previously-synced metadata (important on upgrades).
    const strippedDefaultRoleManifest = isDefined(defaultRoleManifest)
      ? {
          ...defaultRoleManifest,
          objectPermissions: [],
          fieldPermissions: [],
        }
      : undefined;

    const preInstallOnlyManifest: Manifest = {
      application: manifest.application,
      objects: [],
      fields: [],
      logicFunctions: [preInstallLogicFunctionManifest],
      frontComponents: [],
      roles: isDefined(strippedDefaultRoleManifest)
        ? [strippedDefaultRoleManifest]
        : [],
      skills: [],
      agents: [],
      publicAssets: [],
      views: [],
      navigationMenuItems: [],
      pageLayouts: [],
    };

    const now = new Date().toISOString();

    const { twentyStandardFlatApplication } =
      await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow(
        { workspaceId },
      );

    const cacheResult = await this.workspaceCacheService.getOrRecompute(
      workspaceId,
      [
        ...Object.values(ALL_METADATA_NAME).map(getMetadataFlatEntityMapsKey),
        'featureFlagsMap',
      ],
    );

    const { featureFlagsMap, ...existingAllFlatEntityMaps } = cacheResult;

    const fromAllFlatEntityMaps = getApplicationSubAllFlatEntityMaps({
      applicationIds: [ownerFlatApplication.id],
      fromAllFlatEntityMaps: existingAllFlatEntityMaps,
    });

    const toAllUniversalFlatEntityMaps =
      computeApplicationManifestAllUniversalFlatEntityMaps({
        manifest: preInstallOnlyManifest,
        ownerFlatApplication,
        now,
      });

    const dependencyAllFlatEntityMaps = getApplicationSubAllFlatEntityMaps({
      applicationIds:
        ownerFlatApplication.universalIdentifier ===
        TWENTY_STANDARD_APPLICATION.universalIdentifier
          ? [twentyStandardFlatApplication.id]
          : [ownerFlatApplication.id, twentyStandardFlatApplication.id],
      fromAllFlatEntityMaps: existingAllFlatEntityMaps,
    });

    const validateAndBuildResult =
      await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigrationFromTo(
        {
          // inferDeletionFromMissingEntities is intentionally omitted (undefined)
          // so this pared-down sync is purely additive — existing metadata for
          // objects/fields/other logic functions that are absent from
          // preInstallOnlyManifest are left untouched on upgrades.
          buildOptions: {
            isSystemBuild: false,
            applicationUniversalIdentifier:
              ownerFlatApplication.universalIdentifier,
          },
          fromToAllFlatEntityMaps: buildFromToAllUniversalFlatEntityMaps({
            fromAllFlatEntityMaps,
            toAllUniversalFlatEntityMaps,
          }),
          workspaceId,
          dependencyAllFlatEntityMaps,
          additionalCacheDataMaps: { featureFlagsMap },
        },
      );

    if (validateAndBuildResult.status === 'fail') {
      throw new WorkspaceMigrationBuilderException(
        validateAndBuildResult,
        'Validation errors occurred while syncing pre-install logic function',
      );
    }

    await this.syncDefaultRoleAndSettingsCustomTab({
      manifest,
      workspaceId,
      ownerFlatApplication,
    });

    this.logger.log(
      `Pre-install logic function synced for application ${ownerFlatApplication.universalIdentifier}`,
    );
  }

  async syncMetadataFromManifest({
    manifest,
    workspaceId,
    ownerFlatApplication,
  }: {
    manifest: Manifest;
    workspaceId: string;
    ownerFlatApplication: FlatApplication;
  }): Promise<{
    workspaceMigration: WorkspaceMigration;
    hasSchemaMetadataChanged: boolean;
  }> {
    const now = new Date().toISOString();

    const { twentyStandardFlatApplication } =
      await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow(
        { workspaceId },
      );

    const cacheResult = await this.workspaceCacheService.getOrRecompute(
      workspaceId,
      [
        ...Object.values(ALL_METADATA_NAME).map(getMetadataFlatEntityMapsKey),
        'featureFlagsMap',
      ],
    );

    const { featureFlagsMap, ...existingAllFlatEntityMaps } = cacheResult;

    const fromAllFlatEntityMaps = getApplicationSubAllFlatEntityMaps({
      applicationIds: [ownerFlatApplication.id],
      fromAllFlatEntityMaps: existingAllFlatEntityMaps,
    });

    const toAllUniversalFlatEntityMaps =
      computeApplicationManifestAllUniversalFlatEntityMaps({
        manifest,
        ownerFlatApplication,
        now,
      });

    const dependencyAllFlatEntityMaps = getApplicationSubAllFlatEntityMaps({
      applicationIds:
        ownerFlatApplication.universalIdentifier ===
        TWENTY_STANDARD_APPLICATION.universalIdentifier
          ? [twentyStandardFlatApplication.id]
          : [ownerFlatApplication.id, twentyStandardFlatApplication.id],
      fromAllFlatEntityMaps: existingAllFlatEntityMaps,
    });

    const validateAndBuildResult =
      await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigrationFromTo(
        {
          buildOptions: {
            isSystemBuild: false,
            inferDeletionFromMissingEntities: true,
            applicationUniversalIdentifier:
              ownerFlatApplication.universalIdentifier,
          },
          fromToAllFlatEntityMaps: buildFromToAllUniversalFlatEntityMaps({
            fromAllFlatEntityMaps,
            toAllUniversalFlatEntityMaps,
          }),
          workspaceId,
          dependencyAllFlatEntityMaps,
          additionalCacheDataMaps: { featureFlagsMap },
        },
      );

    if (validateAndBuildResult.status === 'fail') {
      throw new WorkspaceMigrationBuilderException(
        validateAndBuildResult,
        'Validation errors occurred while syncing application manifest metadata',
      );
    }

    this.logger.log(
      `Metadata migration completed for application ${ownerFlatApplication.universalIdentifier}`,
    );

    await this.syncRolePermissionsAndDefaultRole({
      manifest,
      workspaceId,
      ownerFlatApplication,
    });

    return {
      workspaceMigration: validateAndBuildResult.workspaceMigration,
      hasSchemaMetadataChanged: validateAndBuildResult.hasSchemaMetadataChanged,
    };
  }

  /**
   * @deprecated should be remove once below issues are resolved:
   *  - [objectPermission](https://github.com/twentyhq/core-team-issues/issues/2223)
   *  - [fieldPermission](https://github.com/twentyhq/core-team-issues/issues/2224)
   *  - [permissionFlag](https://github.com/twentyhq/core-team-issues/issues/2225)
   */
  private async syncRolePermissionsAndDefaultRole({
    manifest,
    workspaceId,
    ownerFlatApplication,
  }: {
    manifest: Manifest;
    workspaceId: string;
    ownerFlatApplication: FlatApplication;
  }) {
    const {
      flatRoleMaps: refreshedFlatRoleMaps,
      flatObjectMetadataMaps: refreshedFlatObjectMetadataMaps,
      flatFieldMetadataMaps: refreshedFlatFieldMetadataMaps,
      flatFrontComponentMaps: refreshedFlatFrontComponentMaps,
    } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
      'flatRoleMaps',
      'flatObjectMetadataMaps',
      'flatFieldMetadataMaps',
      'flatFrontComponentMaps',
    ]);

    let defaultRoleId: string | null = null;

    for (const role of manifest.roles) {
      const flatRole = findFlatEntityByUniversalIdentifier({
        flatEntityMaps: refreshedFlatRoleMaps,
        universalIdentifier: role.universalIdentifier,
      });

      if (!isDefined(flatRole)) {
        throw new ApplicationException(
          `Failed to resolve role for universalIdentifier ${role.universalIdentifier}`,
          ApplicationExceptionCode.ENTITY_NOT_FOUND,
        );
      }

      await this.syncApplicationRolePermissions({
        role,
        workspaceId,
        roleId: flatRole.id,
        refreshedFlatObjectMetadataMaps,
        refreshedFlatFieldMetadataMaps,
      });

      if (
        role.universalIdentifier ===
        manifest.application.defaultRoleUniversalIdentifier
      ) {
        defaultRoleId = flatRole.id;
      }
    }

    let settingsCustomTabFrontComponentId: string | null = null;

    const settingsCustomTabUniversalIdentifier =
      manifest.application.settingsCustomTabFrontComponentUniversalIdentifier;

    if (isDefined(settingsCustomTabUniversalIdentifier)) {
      const flatFrontComponent = findFlatEntityByUniversalIdentifier({
        flatEntityMaps: refreshedFlatFrontComponentMaps,
        universalIdentifier: settingsCustomTabUniversalIdentifier,
      });

      if (!isDefined(flatFrontComponent)) {
        throw new ApplicationException(
          `Failed to resolve front component for settingsCustomTabFrontComponentUniversalIdentifier ${settingsCustomTabUniversalIdentifier}`,
          ApplicationExceptionCode.ENTITY_NOT_FOUND,
        );
      }

      settingsCustomTabFrontComponentId = flatFrontComponent.id;
    }

    await this.applicationService.update(ownerFlatApplication.id, {
      workspaceId,
      settingsCustomTabFrontComponentId,
      ...(isDefined(defaultRoleId) ? { defaultRoleId } : {}),
    });
  }

  private async syncApplicationRolePermissions({
    role,
    workspaceId,
    roleId,
    refreshedFlatObjectMetadataMaps,
    refreshedFlatFieldMetadataMaps,
  }: {
    role: RoleManifest;
    workspaceId: string;
    roleId: string;
    refreshedFlatObjectMetadataMaps: Awaited<
      ReturnType<WorkspaceCacheService['getOrRecompute']>
    >['flatObjectMetadataMaps'];
    refreshedFlatFieldMetadataMaps: Awaited<
      ReturnType<WorkspaceCacheService['getOrRecompute']>
    >['flatFieldMetadataMaps'];
  }) {
    if (
      (role.objectPermissions ?? []).length > 0 ||
      (role.fieldPermissions ?? []).length > 0
    ) {
      const formattedObjectPermissions = role.objectPermissions
        ?.map((permission) => {
          const flatObjectMetadata = findFlatEntityByUniversalIdentifier({
            flatEntityMaps: refreshedFlatObjectMetadataMaps,
            universalIdentifier: permission.objectUniversalIdentifier,
          });

          if (!isDefined(flatObjectMetadata)) {
            throw new ApplicationException(
              `Failed to find object with universalIdentifier ${permission.objectUniversalIdentifier}`,
              ApplicationExceptionCode.OBJECT_NOT_FOUND,
            );
          }

          return {
            ...permission,
            objectMetadataId: flatObjectMetadata.id,
          };
        })
        .filter(
          (
            permission,
          ): permission is typeof permission & { objectMetadataId: string } =>
            isDefined(permission.objectMetadataId),
        );

      if (isDefined(formattedObjectPermissions)) {
        await this.objectPermissionService.upsertObjectPermissions({
          workspaceId,
          input: {
            roleId,
            objectPermissions: formattedObjectPermissions,
          },
        });
      }

      const formattedFieldPermissions = role.fieldPermissions
        ?.map((permission) => {
          const flatObjectMetadata = findFlatEntityByUniversalIdentifier({
            flatEntityMaps: refreshedFlatObjectMetadataMaps,
            universalIdentifier: permission.objectUniversalIdentifier,
          });

          if (!isDefined(flatObjectMetadata)) {
            throw new ApplicationException(
              `Failed to find object with universalIdentifier ${permission.objectUniversalIdentifier}`,
              ApplicationExceptionCode.OBJECT_NOT_FOUND,
            );
          }

          const flatFieldMetadata = findFlatEntityByUniversalIdentifier({
            flatEntityMaps: refreshedFlatFieldMetadataMaps,
            universalIdentifier: permission.fieldUniversalIdentifier,
          });

          if (!isDefined(flatFieldMetadata)) {
            throw new ApplicationException(
              `Failed to find field with universalIdentifier ${permission.fieldUniversalIdentifier}`,
              ApplicationExceptionCode.FIELD_NOT_FOUND,
            );
          }

          return {
            ...permission,
            objectMetadataId: flatObjectMetadata.id,
            fieldMetadataId: flatFieldMetadata.id,
          };
        })
        .filter(
          (
            permission,
          ): permission is typeof permission & {
            objectMetadataId: string;
            fieldMetadataId: string;
          } =>
            isDefined(permission.objectMetadataId) &&
            isDefined(permission.fieldMetadataId),
        );

      if (isDefined(formattedFieldPermissions)) {
        await this.fieldPermissionService.upsertFieldPermissions({
          workspaceId,
          input: {
            roleId,
            fieldPermissions: formattedFieldPermissions,
          },
        });
      }
    }

    if (isDefined(role.permissionFlags) && role.permissionFlags.length > 0) {
      await this.permissionFlagService.upsertPermissionFlags({
        workspaceId,
        input: {
          roleId,
          permissionFlagKeys: role.permissionFlags,
        },
      });
    }
  }
}
