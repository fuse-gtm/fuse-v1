import { Injectable, Logger } from '@nestjs/common';

import { FieldMetadataType, ViewType, ViewVisibility } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FieldMetadataService } from 'src/engine/metadata-modules/field-metadata/services/field-metadata.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { buildObjectIdByNameMaps } from 'src/engine/metadata-modules/flat-object-metadata/utils/build-object-id-by-name-maps.util';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';
import { ViewCalendarLayout } from 'src/engine/metadata-modules/view/enums/view-calendar-layout.enum';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ViewService } from 'src/engine/metadata-modules/view/services/view.service';
import {
  PARTNER_OS_OBJECT_SCHEMAS,
  type PartnerOsObjectSchema,
} from 'src/modules/partner-os/constants/partner-os-schema.constant';

type BootstrapFlatMaps = {
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>;
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>;
  flatViewMaps: FlatEntityMaps<FlatView>;
  objectIdByNameSingular: Record<string, string>;
};

const LEGACY_DISCOVERY_OBJECT_RENAMES = {
  partnerPlay: 'partnerTrack',
  playCheck: 'trackCheck',
  playEnrichment: 'trackEnrichment',
  playExclusion: 'trackExclusion',
} as const;

const LEGACY_RELATION_FIELD_ALIASES: Record<string, Record<string, string>> = {
  trackCheck: {
    partnerTrack: 'partnerPlay',
  },
  trackEnrichment: {
    partnerTrack: 'partnerPlay',
  },
  trackExclusion: {
    partnerTrack: 'partnerPlay',
  },
  discoveryRun: {
    partnerTrack: 'partnerPlay',
  },
  checkEvaluation: {
    trackCheck: 'playCheck',
  },
  enrichmentEvaluation: {
    trackEnrichment: 'playEnrichment',
  },
};

@Injectable()
export class PartnerOsMetadataBootstrapService {
  private readonly logger = new Logger(PartnerOsMetadataBootstrapService.name);

  constructor(
    private readonly dataSourceService: DataSourceService,
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly fieldMetadataService: FieldMetadataService,
    private readonly viewService: ViewService,
    private readonly flatEntityMapsCacheService: WorkspaceManyOrAllFlatEntityMapsCacheService,
  ) {}

  async bootstrap(workspaceId: string): Promise<void> {
    const dataSourceMetadata =
      await this.dataSourceService.getLastDataSourceMetadataFromWorkspaceIdOrFail(
        workspaceId,
      );

    let maps = await this.getFreshFlatMaps(workspaceId);
    maps = await this.renameLegacyDiscoveryObjects({
      workspaceId,
      maps,
    });

    for (const schema of PARTNER_OS_OBJECT_SCHEMAS) {
      const existingObject = this.findObjectByName(schema.object.nameSingular, maps);

      if (!isDefined(existingObject)) {
        await this.objectMetadataService.createOneObject({
          workspaceId,
          createObjectInput: {
            ...schema.object,
            dataSourceId: dataSourceMetadata.id,
          },
        });

        this.logger.log(`Created object ${schema.object.nameSingular}`);
        maps = await this.getFreshFlatMaps(workspaceId);
      }

      const didCreateFields = await this.ensureScalarFields({
        workspaceId,
        schema,
        maps,
      });

      if (didCreateFields) {
        maps = await this.getFreshFlatMaps(workspaceId);
      }
    }

    for (const schema of PARTNER_OS_OBJECT_SCHEMAS) {
      const didCreateRelations = await this.ensureRelations({
        workspaceId,
        schema,
        maps,
      });

      if (didCreateRelations) {
        maps = await this.getFreshFlatMaps(workspaceId);
      }
    }

    for (const schema of PARTNER_OS_OBJECT_SCHEMAS) {
      const didCreateViews = await this.ensureViews({
        workspaceId,
        schema,
        maps,
      });

      if (didCreateViews) {
        maps = await this.getFreshFlatMaps(workspaceId);
      }
    }

    this.logger.log(
      `Partner OS metadata bootstrap completed for workspace ${workspaceId}`,
    );
  }

  private async ensureScalarFields({
    workspaceId,
    schema,
    maps,
  }: {
    workspaceId: string;
    schema: PartnerOsObjectSchema;
    maps: BootstrapFlatMaps;
  }): Promise<boolean> {
    const object = this.findObjectByNameOrFail(schema.object.nameSingular, maps);
    const existingFieldNames = new Set(
      this.getObjectFields(object, maps).map((field) => field.name),
    );

    const createFieldInputs = schema.fields
      .filter((field) => !existingFieldNames.has(field.name))
      .map((field) => ({
        ...field,
        objectMetadataId: object.id,
      }));

    if (createFieldInputs.length === 0) {
      return false;
    }

    await this.fieldMetadataService.createManyFields({
      workspaceId,
      createFieldInputs,
    });

    this.logger.log(
      `Created ${createFieldInputs.length} field(s) on ${schema.object.nameSingular}`,
    );

    return true;
  }

  private async ensureRelations({
    workspaceId,
    schema,
    maps,
  }: {
    workspaceId: string;
    schema: PartnerOsObjectSchema;
    maps: BootstrapFlatMaps;
  }): Promise<boolean> {
    if (schema.relations.length === 0) {
      return false;
    }

    const sourceObject = this.findObjectByNameOrFail(
      schema.object.nameSingular,
      maps,
    );
    const sourceFieldNames = new Set(
      this.getObjectFields(sourceObject, maps).map((field) => field.name),
    );

    const relationFieldInputs = schema.relations
      .filter(
        (relation) =>
          !this.hasExistingRelationField({
            schemaObjectName: schema.object.nameSingular,
            relationName: relation.name,
            existingFieldNames: sourceFieldNames,
          }),
      )
      .map((relation) => {
        const targetObject = this.findObjectByNameOrFail(
          relation.targetObjectName,
          maps,
        );

        return {
          type: FieldMetadataType.RELATION,
          name: relation.name,
          label: relation.label,
          icon: relation.icon,
          objectMetadataId: sourceObject.id,
          relationCreationPayload: {
            type: relation.relationType,
            targetFieldLabel: relation.targetFieldLabel,
            targetFieldIcon: relation.targetFieldIcon,
            targetObjectMetadataId: targetObject.id,
          },
        };
      });

    if (relationFieldInputs.length === 0) {
      return false;
    }

    await this.fieldMetadataService.createManyFields({
      workspaceId,
      createFieldInputs: relationFieldInputs,
    });

    this.logger.log(
      `Created ${relationFieldInputs.length} relation field(s) on ${schema.object.nameSingular}`,
    );

    return true;
  }

  private async ensureViews({
    workspaceId,
    schema,
    maps,
  }: {
    workspaceId: string;
    schema: PartnerOsObjectSchema;
    maps: BootstrapFlatMaps;
  }): Promise<boolean> {
    const object = this.findObjectByNameOrFail(schema.object.nameSingular, maps);
    const objectFields = this.getObjectFields(object, maps);
    const objectViews = Object.values(maps.flatViewMaps.byUniversalIdentifier)
      .filter(isDefined)
      .filter(
        (view) =>
          view.objectMetadataUniversalIdentifier === object.universalIdentifier &&
          view.deletedAt === null,
      );

    let didCreateView = false;
    let nextPosition = this.getNextViewPosition(objectViews);

    if (
      isDefined(schema.kanbanFieldName) &&
      !objectViews.some((view) => view.type === ViewType.KANBAN)
    ) {
      const kanbanField = objectFields.find(
        (field) => field.name === schema.kanbanFieldName,
      );

      if (
        isDefined(kanbanField) &&
        kanbanField.type === FieldMetadataType.SELECT
      ) {
        await this.viewService.createOne({
          workspaceId,
          createViewInput: {
            name: `By ${kanbanField.label}`,
            icon: 'IconLayoutKanban',
            objectMetadataId: object.id,
            position: nextPosition,
            type: ViewType.KANBAN,
            visibility: ViewVisibility.WORKSPACE,
            mainGroupByFieldMetadataId: kanbanField.id,
          },
        });

        didCreateView = true;
        nextPosition += 1;
        this.logger.log(`Created Kanban view for ${schema.object.nameSingular}`);
      } else {
        this.logger.warn(
          `Skipped Kanban view for ${schema.object.nameSingular}: ${schema.kanbanFieldName} missing or not a SELECT field`,
        );
      }
    }

    if (
      isDefined(schema.calendarFieldName) &&
      !objectViews.some((view) => view.type === ViewType.CALENDAR)
    ) {
      const calendarField = objectFields.find(
        (field) => field.name === schema.calendarFieldName,
      );

      if (
        isDefined(calendarField) &&
        [FieldMetadataType.DATE, FieldMetadataType.DATE_TIME].includes(
          calendarField.type,
        )
      ) {
        await this.viewService.createOne({
          workspaceId,
          createViewInput: {
            name: `Calendar by ${calendarField.label}`,
            icon: 'IconCalendarEvent',
            objectMetadataId: object.id,
            position: nextPosition,
            type: ViewType.CALENDAR,
            visibility: ViewVisibility.WORKSPACE,
            calendarLayout: ViewCalendarLayout.MONTH,
            calendarFieldMetadataId: calendarField.id,
          },
        });

        didCreateView = true;
        this.logger.log(`Created Calendar view for ${schema.object.nameSingular}`);
      } else {
        this.logger.warn(
          `Skipped Calendar view for ${schema.object.nameSingular}: ${schema.calendarFieldName} missing or not a date field`,
        );
      }
    }

    return didCreateView;
  }

  private hasExistingRelationField({
    schemaObjectName,
    relationName,
    existingFieldNames,
  }: {
    schemaObjectName: string;
    relationName: string;
    existingFieldNames: Set<string>;
  }): boolean {
    if (existingFieldNames.has(relationName)) {
      return true;
    }

    const legacyRelationName =
      LEGACY_RELATION_FIELD_ALIASES[schemaObjectName]?.[relationName];

    return isDefined(legacyRelationName) && existingFieldNames.has(legacyRelationName);
  }

  private async renameLegacyDiscoveryObjects({
    workspaceId,
    maps,
  }: {
    workspaceId: string;
    maps: BootstrapFlatMaps;
  }): Promise<BootstrapFlatMaps> {
    let nextMaps = maps;

    for (const [legacyName, currentName] of Object.entries(
      LEGACY_DISCOVERY_OBJECT_RENAMES,
    )) {
      const legacyObject = this.findObjectByName(legacyName, nextMaps);

      if (!isDefined(legacyObject)) {
        continue;
      }

      const currentObject = this.findObjectByName(currentName, nextMaps);

      if (isDefined(currentObject)) {
        this.logger.warn(
          `Skipping legacy object rename ${legacyName} -> ${currentName} because both objects exist`,
        );

        continue;
      }

      const targetSchema = PARTNER_OS_OBJECT_SCHEMAS.find(
        (schema) => schema.object.nameSingular === currentName,
      );

      if (!isDefined(targetSchema)) {
        this.logger.warn(
          `Skipping legacy object rename ${legacyName} -> ${currentName} because target schema is missing`,
        );

        continue;
      }

      await this.objectMetadataService.updateOneObject({
        workspaceId,
        updateObjectInput: {
          id: legacyObject.id,
          update: {
            nameSingular: targetSchema.object.nameSingular,
            namePlural: targetSchema.object.namePlural,
            labelSingular: targetSchema.object.labelSingular,
            labelPlural: targetSchema.object.labelPlural,
            description: targetSchema.object.description,
            icon: targetSchema.object.icon,
          },
        },
      });

      this.logger.log(`Renamed legacy object ${legacyName} -> ${currentName}`);
      nextMaps = await this.getFreshFlatMaps(workspaceId);
    }

    return nextMaps;
  }

  private findObjectByName(
    objectName: string,
    maps: BootstrapFlatMaps,
  ): FlatObjectMetadata | undefined {
    const objectId = maps.objectIdByNameSingular[objectName];

    if (!isDefined(objectId)) {
      return undefined;
    }

    return findFlatEntityByIdInFlatEntityMaps({
      flatEntityId: objectId,
      flatEntityMaps: maps.flatObjectMetadataMaps,
    });
  }

  private findObjectByNameOrFail(
    objectName: string,
    maps: BootstrapFlatMaps,
  ): FlatObjectMetadata {
    const object = this.findObjectByName(objectName, maps);

    if (!isDefined(object)) {
      throw new Error(`Object ${objectName} is missing in workspace metadata`);
    }

    return object;
  }

  private getObjectFields(
    object: FlatObjectMetadata,
    maps: BootstrapFlatMaps,
  ): FlatFieldMetadata[] {
    return object.fieldIds
      .map((fieldId) =>
        findFlatEntityByIdInFlatEntityMaps({
          flatEntityId: fieldId,
          flatEntityMaps: maps.flatFieldMetadataMaps,
        }),
      )
      .filter(isDefined);
  }

  private getNextViewPosition(objectViews: FlatView[]): number {
    if (objectViews.length === 0) {
      return 1;
    }

    const maxPosition = Math.max(...objectViews.map((view) => view.position));

    return maxPosition + 1;
  }

  private async getFreshFlatMaps(workspaceId: string): Promise<BootstrapFlatMaps> {
    await this.flatEntityMapsCacheService.invalidateFlatEntityMaps({
      workspaceId,
      flatMapsKeys: [
        'flatObjectMetadataMaps',
        'flatFieldMetadataMaps',
        'flatViewMaps',
      ],
    });

    const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatViewMaps } =
      await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps(
        {
          workspaceId,
          flatMapsKeys: [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatViewMaps',
          ],
        },
      );

    const { idByNameSingular } = buildObjectIdByNameMaps(flatObjectMetadataMaps);

    return {
      flatObjectMetadataMaps,
      flatFieldMetadataMaps,
      flatViewMaps,
      objectIdByNameSingular: idByNameSingular,
    };
  }
}
