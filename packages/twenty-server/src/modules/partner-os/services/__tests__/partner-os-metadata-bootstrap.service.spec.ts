import { FieldMetadataType, ViewType } from 'twenty-shared/types';

import { PARTNER_OS_OBJECT_SCHEMAS } from 'src/modules/partner-os/constants/partner-os-schema.constant';

import {
  buildFakeFlatMaps,
  configureFlatMapsReturn,
  createBootstrapMocks,
} from './fixtures/partner-os-test.fixtures';

const WORKSPACE_ID = 'workspace-1';

// Helper: builds a complete workspace with all 16 partner-os objects,
// their scalar fields, relation fields, and standard Twenty objects.
const buildFullWorkspace = (opts?: { includeViews?: boolean }) => {
  const allObjects = PARTNER_OS_OBJECT_SCHEMAS.map((schema, index) => ({
    nameSingular: schema.object.nameSingular,
    namePlural: schema.object.namePlural,
    id: `obj-${index}`,
    fields: [
      ...schema.fields.map((field, fieldIndex) => ({
        name: field.name,
        type: field.type,
        id: `field-${index}-${fieldIndex}`,
        label: field.label,
      })),
      ...schema.relations.map((relation, relIndex) => ({
        name: relation.name,
        type: FieldMetadataType.RELATION as FieldMetadataType,
        id: `rel-${index}-${relIndex}`,
        label: relation.label,
      })),
    ],
    views: opts?.includeViews
      ? [
          ...(schema.kanbanFieldName
            ? [
                {
                  id: `kanban-${index}`,
                  type: ViewType.KANBAN as ViewType,
                  position: 1,
                },
              ]
            : []),
          ...(schema.calendarFieldName
            ? [
                {
                  id: `calendar-${index}`,
                  type: ViewType.CALENDAR as ViewType,
                  position: 2,
                },
              ]
            : []),
        ]
      : [],
  }));

  const standardObjects = [
    {
      nameSingular: 'company',
      namePlural: 'companies',
      id: 'std-company',
      fields: [] as any[],
      views: [] as any[],
    },
    {
      nameSingular: 'person',
      namePlural: 'persons',
      id: 'std-person',
      fields: [] as any[],
      views: [] as any[],
    },
    {
      nameSingular: 'opportunity',
      namePlural: 'opportunities',
      id: 'std-opportunity',
      fields: [] as any[],
      views: [] as any[],
    },
    {
      nameSingular: 'workspaceMember',
      namePlural: 'workspaceMembers',
      id: 'std-wm',
      fields: [] as any[],
      views: [] as any[],
    },
  ];

  return [...allObjects, ...standardObjects];
};

describe('PartnerOsMetadataBootstrapService', () => {
  describe('bootstrap', () => {
    describe('data source lookup', () => {
      it('should call getLastDataSourceMetadataFromWorkspaceIdOrFail with workspaceId', async () => {
        const {
          service,
          mockDataSourceService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        // Fully populated workspace → bootstrap is a no-op
        configureFlatMapsReturn(
          mockFlatEntityMapsCacheService,
          buildFullWorkspace({ includeViews: true }),
        );

        await service.bootstrap(WORKSPACE_ID);

        expect(
          mockDataSourceService.getLastDataSourceMetadataFromWorkspaceIdOrFail,
        ).toHaveBeenCalledWith(WORKSPACE_ID);
      });

      it('should throw when data source lookup fails', async () => {
        const { service, mockDataSourceService } = createBootstrapMocks();

        mockDataSourceService.getLastDataSourceMetadataFromWorkspaceIdOrFail.mockRejectedValue(
          new Error('No data source'),
        );

        await expect(service.bootstrap(WORKSPACE_ID)).rejects.toThrow(
          'No data source',
        );
      });
    });

    describe('object creation', () => {
      it('should create objects when workspace is empty', async () => {
        const {
          service,
          mockObjectMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        const standardObjects = [
          {
            nameSingular: 'company',
            namePlural: 'companies',
            id: 'std-company',
            fields: [] as any[],
          },
          {
            nameSingular: 'person',
            namePlural: 'persons',
            id: 'std-person',
            fields: [] as any[],
          },
          {
            nameSingular: 'opportunity',
            namePlural: 'opportunities',
            id: 'std-opportunity',
            fields: [] as any[],
          },
          {
            nameSingular: 'workspaceMember',
            namePlural: 'workspaceMembers',
            id: 'std-wm',
            fields: [] as any[],
          },
        ];

        // Track objects as they get "created" by the bootstrap
        const createdObjects: any[] = [];

        mockObjectMetadataService.createOneObject.mockImplementation(
          async ({ createObjectInput }: any) => {
            createdObjects.push({
              nameSingular: createObjectInput.nameSingular,
              namePlural: createObjectInput.namePlural,
              id: `obj-${createdObjects.length}`,
              fields: [],
            });

            return { id: `obj-${createdObjects.length - 1}` };
          },
        );

        mockFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps.mockImplementation(
          async () => {
            const maps = buildFakeFlatMaps([
              ...createdObjects,
              ...standardObjects,
            ]);

            return {
              flatObjectMetadataMaps: maps.flatObjectMetadataMaps,
              flatFieldMetadataMaps: maps.flatFieldMetadataMaps,
              flatViewMaps: maps.flatViewMaps,
            };
          },
        );

        await service.bootstrap(WORKSPACE_ID);

        expect(mockObjectMetadataService.createOneObject).toHaveBeenCalledTimes(
          16,
        );
      });

      it('should skip objects that already exist', async () => {
        const {
          service,
          mockObjectMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        configureFlatMapsReturn(
          mockFlatEntityMapsCacheService,
          buildFullWorkspace({ includeViews: true }),
        );

        await service.bootstrap(WORKSPACE_ID);

        expect(
          mockObjectMetadataService.createOneObject,
        ).not.toHaveBeenCalled();
      });

      it('should pass dataSourceId from lookup to createOneObject', async () => {
        const {
          service,
          mockDataSourceService,
          mockObjectMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        mockDataSourceService.getLastDataSourceMetadataFromWorkspaceIdOrFail.mockResolvedValue(
          { id: 'custom-ds-id' },
        );

        const standardObjects = [
          {
            nameSingular: 'company',
            namePlural: 'companies',
            id: 'std-company',
            fields: [] as any[],
          },
          {
            nameSingular: 'person',
            namePlural: 'persons',
            id: 'std-person',
            fields: [] as any[],
          },
          {
            nameSingular: 'opportunity',
            namePlural: 'opportunities',
            id: 'std-opportunity',
            fields: [] as any[],
          },
          {
            nameSingular: 'workspaceMember',
            namePlural: 'workspaceMembers',
            id: 'std-wm',
            fields: [] as any[],
          },
        ];

        const createdObjects: any[] = [];

        mockObjectMetadataService.createOneObject.mockImplementation(
          async ({ createObjectInput }: any) => {
            createdObjects.push({
              nameSingular: createObjectInput.nameSingular,
              namePlural: createObjectInput.namePlural,
              id: `obj-${createdObjects.length}`,
              fields: [],
            });

            return { id: `obj-${createdObjects.length - 1}` };
          },
        );

        mockFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps.mockImplementation(
          async () => {
            const maps = buildFakeFlatMaps([
              ...createdObjects,
              ...standardObjects,
            ]);

            return {
              flatObjectMetadataMaps: maps.flatObjectMetadataMaps,
              flatFieldMetadataMaps: maps.flatFieldMetadataMaps,
              flatViewMaps: maps.flatViewMaps,
            };
          },
        );

        await service.bootstrap(WORKSPACE_ID);

        const firstCall =
          mockObjectMetadataService.createOneObject.mock.calls[0][0];

        expect(firstCall.createObjectInput.dataSourceId).toBe('custom-ds-id');
      });
    });

    describe('scalar field creation', () => {
      it('should create fields for objects that have no fields', async () => {
        const {
          service,
          mockFieldMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        // All objects exist but with no fields
        const objectDefs = PARTNER_OS_OBJECT_SCHEMAS.map((schema, index) => ({
          nameSingular: schema.object.nameSingular,
          namePlural: schema.object.namePlural,
          id: `obj-${index}`,
          fields: [] as any[],
        }));

        const standardObjects = [
          {
            nameSingular: 'company',
            namePlural: 'companies',
            id: 'std-company',
            fields: [] as any[],
          },
          {
            nameSingular: 'person',
            namePlural: 'persons',
            id: 'std-person',
            fields: [] as any[],
          },
          {
            nameSingular: 'opportunity',
            namePlural: 'opportunities',
            id: 'std-opportunity',
            fields: [] as any[],
          },
          {
            nameSingular: 'workspaceMember',
            namePlural: 'workspaceMembers',
            id: 'std-wm',
            fields: [] as any[],
          },
        ];

        configureFlatMapsReturn(mockFlatEntityMapsCacheService, [
          ...objectDefs,
          ...standardObjects,
        ]);

        await service.bootstrap(WORKSPACE_ID);

        // Should call createManyFields for objects with schema-defined fields
        const scalarFieldCalls =
          mockFieldMetadataService.createManyFields.mock.calls.filter(
            (call: any[]) =>
              call[0].createFieldInputs.some(
                (input: any) => input.type !== FieldMetadataType.RELATION,
              ),
          );

        expect(scalarFieldCalls.length).toBeGreaterThan(0);
      });

      it('should skip fields that already exist by name', async () => {
        const {
          service,
          mockFieldMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        // All objects with all scalar fields AND relation fields already exist
        configureFlatMapsReturn(
          mockFlatEntityMapsCacheService,
          buildFullWorkspace({ includeViews: true }),
        );

        await service.bootstrap(WORKSPACE_ID);

        expect(
          mockFieldMetadataService.createManyFields,
        ).not.toHaveBeenCalled();
      });

      it('should pass objectMetadataId to each field input', async () => {
        const {
          service,
          mockFieldMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        // Lead object exists with no fields; all other objects fully populated
        const fullWorkspace = buildFullWorkspace();
        const leadIndex = fullWorkspace.findIndex(
          (obj) => obj.nameSingular === 'lead',
        );

        fullWorkspace[leadIndex] = {
          ...fullWorkspace[leadIndex],
          fields: [],
        };

        configureFlatMapsReturn(mockFlatEntityMapsCacheService, fullWorkspace);

        await service.bootstrap(WORKSPACE_ID);

        // Find the createManyFields call for the lead object
        const leadFieldCall =
          mockFieldMetadataService.createManyFields.mock.calls.find(
            (call: any[]) =>
              call[0].createFieldInputs.some(
                (input: any) => input.objectMetadataId === `obj-${leadIndex}`,
              ),
          );

        expect(leadFieldCall).toBeDefined();

        for (const input of leadFieldCall[0].createFieldInputs) {
          expect(input.objectMetadataId).toBe(`obj-${leadIndex}`);
        }
      });
    });

    describe('relation creation', () => {
      it('should throw when target object is missing', async () => {
        const { service, mockFlatEntityMapsCacheService } =
          createBootstrapMocks();

        // Lead object exists with fields, but its relation target 'partnerProfile' is missing
        const leadSchema = PARTNER_OS_OBJECT_SCHEMAS[0];

        configureFlatMapsReturn(mockFlatEntityMapsCacheService, [
          {
            nameSingular: 'lead',
            namePlural: 'leads',
            id: 'obj-lead',
            fields: leadSchema.fields.map((f, i) => ({
              name: f.name,
              type: f.type,
              id: `field-lead-${i}`,
              label: f.label,
            })),
          },
          // Missing partnerProfile → relation creation will throw
        ]);

        await expect(service.bootstrap(WORKSPACE_ID)).rejects.toThrow(
          /missing in workspace metadata/,
        );
      });

      it('should skip relations where source field already exists', async () => {
        const {
          service,
          mockFieldMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        // Full workspace with all fields including relations
        configureFlatMapsReturn(
          mockFlatEntityMapsCacheService,
          buildFullWorkspace({ includeViews: true }),
        );

        await service.bootstrap(WORKSPACE_ID);

        // No createManyFields calls should be made for relations
        expect(
          mockFieldMetadataService.createManyFields,
        ).not.toHaveBeenCalled();
      });
    });

    describe('legacy object renaming', () => {
      it('should rename legacy object when only old name exists', async () => {
        const {
          service,
          mockObjectMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        let callCount = 0;

        mockFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps.mockImplementation(
          async () => {
            callCount += 1;

            if (callCount === 1) {
              // Initial: legacy-named object "partnerPlay" exists
              const maps = buildFakeFlatMaps([
                {
                  nameSingular: 'partnerPlay',
                  namePlural: 'partnerPlays',
                  id: 'obj-legacy-play',
                  fields: [],
                },
              ]);

              return {
                flatObjectMetadataMaps: maps.flatObjectMetadataMaps,
                flatFieldMetadataMaps: maps.flatFieldMetadataMaps,
                flatViewMaps: maps.flatViewMaps,
              };
            }

            // After rename + creation: full workspace
            const maps = buildFakeFlatMaps(
              buildFullWorkspace({ includeViews: true }),
            );

            return {
              flatObjectMetadataMaps: maps.flatObjectMetadataMaps,
              flatFieldMetadataMaps: maps.flatFieldMetadataMaps,
              flatViewMaps: maps.flatViewMaps,
            };
          },
        );

        await service.bootstrap(WORKSPACE_ID);

        expect(mockObjectMetadataService.updateOneObject).toHaveBeenCalledWith(
          expect.objectContaining({
            workspaceId: WORKSPACE_ID,
            updateObjectInput: expect.objectContaining({
              id: 'obj-legacy-play',
              update: expect.objectContaining({
                nameSingular: 'partnerTrack',
              }),
            }),
          }),
        );
      });

      it('should skip rename when both legacy and current names exist', async () => {
        const {
          service,
          mockObjectMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        let callCount = 0;

        mockFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps.mockImplementation(
          async () => {
            callCount += 1;

            if (callCount === 1) {
              // Both old and new names exist
              const maps = buildFakeFlatMaps([
                {
                  nameSingular: 'partnerPlay',
                  namePlural: 'partnerPlays',
                  id: 'obj-legacy',
                  fields: [],
                },
                {
                  nameSingular: 'partnerTrack',
                  namePlural: 'partnerTracks',
                  id: 'obj-current',
                  fields: [],
                },
              ]);

              return {
                flatObjectMetadataMaps: maps.flatObjectMetadataMaps,
                flatFieldMetadataMaps: maps.flatFieldMetadataMaps,
                flatViewMaps: maps.flatViewMaps,
              };
            }

            // After: full workspace
            const maps = buildFakeFlatMaps(
              buildFullWorkspace({ includeViews: true }),
            );

            return {
              flatObjectMetadataMaps: maps.flatObjectMetadataMaps,
              flatFieldMetadataMaps: maps.flatFieldMetadataMaps,
              flatViewMaps: maps.flatViewMaps,
            };
          },
        );

        await service.bootstrap(WORKSPACE_ID);

        expect(
          mockObjectMetadataService.updateOneObject,
        ).not.toHaveBeenCalled();
      });

      it('should skip rename when legacy object does not exist', async () => {
        const {
          service,
          mockObjectMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        configureFlatMapsReturn(
          mockFlatEntityMapsCacheService,
          buildFullWorkspace({ includeViews: true }),
        );

        await service.bootstrap(WORKSPACE_ID);

        expect(
          mockObjectMetadataService.updateOneObject,
        ).not.toHaveBeenCalled();
      });
    });

    describe('view creation', () => {
      it('should create Kanban view when kanbanFieldName is defined and field is SELECT', async () => {
        const { service, mockViewService, mockFlatEntityMapsCacheService } =
          createBootstrapMocks();

        // Full workspace without views
        configureFlatMapsReturn(
          mockFlatEntityMapsCacheService,
          buildFullWorkspace(),
        );

        await service.bootstrap(WORKSPACE_ID);

        const kanbanCalls = mockViewService.createOne.mock.calls.filter(
          (call: any[]) => call[0].createViewInput.type === ViewType.KANBAN,
        );

        expect(kanbanCalls.length).toBeGreaterThan(0);
      });

      it('should create Calendar view when calendarFieldName is defined', async () => {
        const { service, mockViewService, mockFlatEntityMapsCacheService } =
          createBootstrapMocks();

        configureFlatMapsReturn(
          mockFlatEntityMapsCacheService,
          buildFullWorkspace(),
        );

        await service.bootstrap(WORKSPACE_ID);

        const calendarCalls = mockViewService.createOne.mock.calls.filter(
          (call: any[]) => call[0].createViewInput.type === ViewType.CALENDAR,
        );

        expect(calendarCalls.length).toBeGreaterThan(0);
      });

      it('should skip views when they already exist', async () => {
        const { service, mockViewService, mockFlatEntityMapsCacheService } =
          createBootstrapMocks();

        configureFlatMapsReturn(
          mockFlatEntityMapsCacheService,
          buildFullWorkspace({ includeViews: true }),
        );

        await service.bootstrap(WORKSPACE_ID);

        expect(mockViewService.createOne).not.toHaveBeenCalled();
      });
    });

    describe('idempotency', () => {
      it('should be a no-op when everything exists', async () => {
        const {
          service,
          mockObjectMetadataService,
          mockFieldMetadataService,
          mockViewService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        configureFlatMapsReturn(
          mockFlatEntityMapsCacheService,
          buildFullWorkspace({ includeViews: true }),
        );

        await service.bootstrap(WORKSPACE_ID);

        expect(
          mockObjectMetadataService.createOneObject,
        ).not.toHaveBeenCalled();
        expect(
          mockObjectMetadataService.updateOneObject,
        ).not.toHaveBeenCalled();
        expect(
          mockFieldMetadataService.createManyFields,
        ).not.toHaveBeenCalled();
        expect(mockViewService.createOne).not.toHaveBeenCalled();
      });
    });

    describe('error propagation', () => {
      it('should propagate createOneObject errors', async () => {
        const {
          service,
          mockObjectMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        configureFlatMapsReturn(mockFlatEntityMapsCacheService, [
          {
            nameSingular: 'company',
            namePlural: 'companies',
            id: 'std-company',
            fields: [],
          },
          {
            nameSingular: 'person',
            namePlural: 'persons',
            id: 'std-person',
            fields: [],
          },
          {
            nameSingular: 'opportunity',
            namePlural: 'opportunities',
            id: 'std-opportunity',
            fields: [],
          },
          {
            nameSingular: 'workspaceMember',
            namePlural: 'workspaceMembers',
            id: 'std-wm',
            fields: [],
          },
        ]);

        mockObjectMetadataService.createOneObject.mockRejectedValue(
          new Error('DB constraint violation'),
        );

        await expect(service.bootstrap(WORKSPACE_ID)).rejects.toThrow(
          'DB constraint violation',
        );
      });

      it('should propagate createManyFields errors', async () => {
        const {
          service,
          mockFieldMetadataService,
          mockFlatEntityMapsCacheService,
        } = createBootstrapMocks();

        // Objects exist but no fields → triggers field creation
        const objectDefs = PARTNER_OS_OBJECT_SCHEMAS.map((schema, index) => ({
          nameSingular: schema.object.nameSingular,
          namePlural: schema.object.namePlural,
          id: `obj-${index}`,
          fields: [] as any[],
        }));

        configureFlatMapsReturn(mockFlatEntityMapsCacheService, [
          ...objectDefs,
          {
            nameSingular: 'company',
            namePlural: 'companies',
            id: 'std-company',
            fields: [] as any[],
          },
          {
            nameSingular: 'person',
            namePlural: 'persons',
            id: 'std-person',
            fields: [] as any[],
          },
          {
            nameSingular: 'opportunity',
            namePlural: 'opportunities',
            id: 'std-opportunity',
            fields: [] as any[],
          },
          {
            nameSingular: 'workspaceMember',
            namePlural: 'workspaceMembers',
            id: 'std-wm',
            fields: [] as any[],
          },
        ]);

        mockFieldMetadataService.createManyFields.mockRejectedValue(
          new Error('Field creation failed'),
        );

        await expect(service.bootstrap(WORKSPACE_ID)).rejects.toThrow(
          'Field creation failed',
        );
      });

      it('should propagate viewService.createOne errors', async () => {
        const { service, mockViewService, mockFlatEntityMapsCacheService } =
          createBootstrapMocks();

        // Full workspace without views → triggers view creation
        configureFlatMapsReturn(
          mockFlatEntityMapsCacheService,
          buildFullWorkspace(),
        );

        mockViewService.createOne.mockRejectedValue(
          new Error('View creation failed'),
        );

        await expect(service.bootstrap(WORKSPACE_ID)).rejects.toThrow(
          'View creation failed',
        );
      });
    });
  });

  describe('findObjectByNameOrFail', () => {
    it('should throw descriptive error when object not found', () => {
      const { service } = createBootstrapMocks();
      const emptyMaps = buildFakeFlatMaps([]);

      expect(() =>
        (service as any).findObjectByNameOrFail('nonExistent', emptyMaps),
      ).toThrow('Object nonExistent is missing in workspace metadata');
    });
  });

  describe('getNextViewPosition', () => {
    it('should return 1 when no views exist', () => {
      const { service } = createBootstrapMocks();

      expect((service as any).getNextViewPosition([])).toBe(1);
    });

    it('should return max position + 1', () => {
      const { service } = createBootstrapMocks();
      const views = [{ position: 2 }, { position: 5 }, { position: 3 }];

      expect((service as any).getNextViewPosition(views)).toBe(6);
    });
  });

  describe('hasExistingRelationField', () => {
    it('should return true when relation field exists by name', () => {
      const { service } = createBootstrapMocks();

      const result = (service as any).hasExistingRelationField({
        schemaObjectName: 'lead',
        relationName: 'sourcePartnerProfile',
        existingFieldNames: new Set(['sourcePartnerProfile']),
      });

      expect(result).toBe(true);
    });

    it('should return true when legacy alias exists', () => {
      const { service } = createBootstrapMocks();

      // trackCheck has legacy alias: partnerTrack -> partnerPlay
      const result = (service as any).hasExistingRelationField({
        schemaObjectName: 'trackCheck',
        relationName: 'partnerTrack',
        existingFieldNames: new Set(['partnerPlay']),
      });

      expect(result).toBe(true);
    });

    it('should return false when neither current nor legacy name exists', () => {
      const { service } = createBootstrapMocks();

      const result = (service as any).hasExistingRelationField({
        schemaObjectName: 'trackCheck',
        relationName: 'partnerTrack',
        existingFieldNames: new Set([]),
      });

      expect(result).toBe(false);
    });
  });
});
