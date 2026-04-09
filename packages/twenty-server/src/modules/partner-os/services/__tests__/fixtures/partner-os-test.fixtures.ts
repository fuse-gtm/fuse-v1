import { type FieldMetadataType, type ViewType } from 'twenty-shared/types';

import { PartnerOsMetadataBootstrapService } from 'src/modules/partner-os/services/partner-os-metadata-bootstrap.service';
import {
  type CandidateScoreInput,
  type CheckEvaluation,
  type RankingSignal,
  type RetrievalCheck,
} from 'src/modules/partner-os/types/partner-discovery.types';

// -- Scoring fixtures --

export const buildSignal = (
  overrides?: Partial<RankingSignal>,
): RankingSignal => ({
  id: 'signal-1',
  label: 'Has API',
  prompt: 'Does the company have a public API?',
  weight: 10,
  gateMode: 'signal',
  ...overrides,
});

export const buildEvaluation = (
  overrides?: Partial<CheckEvaluation>,
): CheckEvaluation => ({
  checkId: 'signal-1',
  status: 'Match',
  ...overrides,
});

export const buildScoreInput = (
  overrides?: Partial<CandidateScoreInput>,
): CandidateScoreInput => ({
  evaluations: [
    buildEvaluation({ checkId: 'signal-1', status: 'Match' }),
    buildEvaluation({ checkId: 'signal-2', status: 'No Match' }),
  ],
  signals: [
    buildSignal({ id: 'signal-1', label: 'Has API', weight: 10 }),
    buildSignal({ id: 'signal-2', label: 'B2B SaaS', weight: 20 }),
  ],
  isExcluded: false,
  ...overrides,
});

// -- Discovery adapter fixtures --

export const buildRetrievalCheck = (
  overrides?: Partial<RetrievalCheck>,
): RetrievalCheck => ({
  id: 'check-1',
  prompt: 'Has a public API',
  ...overrides,
});

export const buildExaInput = (
  overrides?: Partial<{
    query: string;
    entityType: 'company' | 'person';
    retrievalChecks: RetrievalCheck[];
    exclusions: string[];
  }>,
) => ({
  query: 'AI software startups',
  entityType: 'company' as const,
  retrievalChecks: [
    buildRetrievalCheck({ id: 'check-1', prompt: 'Has a public API' }),
    buildRetrievalCheck({ id: 'check-2', prompt: 'Series A or later' }),
  ],
  exclusions: ['competitor.com', 'badfit.io'],
  ...overrides,
});

// -- Bootstrap service fixtures --

type FakeObjectDef = {
  nameSingular: string;
  namePlural: string;
  id: string;
  fields: {
    name: string;
    type: FieldMetadataType;
    id: string;
    label?: string;
  }[];
  views?: { id: string; type: ViewType; position: number }[];
};

// Builds minimal FlatEntityMaps shims that satisfy the bootstrap service's
// lookup logic via findFlatEntityByIdInFlatEntityMaps and buildObjectIdByNameMaps.
export const buildFakeFlatMaps = (objectDefs: FakeObjectDef[]) => {
  const flatObjectMetadataMaps = {
    byUniversalIdentifier: {} as Record<string, any>,
    universalIdentifierById: {} as Record<string, string>,
    universalIdentifiersByApplicationId: {} as Record<string, string[]>,
  };

  const flatFieldMetadataMaps = {
    byUniversalIdentifier: {} as Record<string, any>,
    universalIdentifierById: {} as Record<string, string>,
    universalIdentifiersByApplicationId: {} as Record<string, string[]>,
  };

  const flatViewMaps = {
    byUniversalIdentifier: {} as Record<string, any>,
    universalIdentifierById: {} as Record<string, string>,
    universalIdentifiersByApplicationId: {} as Record<string, string[]>,
  };

  for (const objectDef of objectDefs) {
    const objectUid = `object:${objectDef.nameSingular}`;

    flatObjectMetadataMaps.byUniversalIdentifier[objectUid] = {
      id: objectDef.id,
      nameSingular: objectDef.nameSingular,
      namePlural: objectDef.namePlural,
      universalIdentifier: objectUid,
      fieldIds: objectDef.fields.map((field) => field.id),
    };
    flatObjectMetadataMaps.universalIdentifierById[objectDef.id] = objectUid;

    for (const field of objectDef.fields) {
      const fieldUid = `field:${objectDef.nameSingular}:${field.name}`;

      flatFieldMetadataMaps.byUniversalIdentifier[fieldUid] = {
        id: field.id,
        name: field.name,
        type: field.type,
        label: field.label ?? field.name,
        universalIdentifier: fieldUid,
      };
      flatFieldMetadataMaps.universalIdentifierById[field.id] = fieldUid;
    }

    for (const view of objectDef.views ?? []) {
      const viewUid = `view:${objectDef.nameSingular}:${view.id}`;

      flatViewMaps.byUniversalIdentifier[viewUid] = {
        id: view.id,
        objectMetadataUniversalIdentifier: objectUid,
        type: view.type,
        position: view.position,
        deletedAt: null,
        universalIdentifier: viewUid,
      };
      flatViewMaps.universalIdentifierById[view.id] = viewUid;
    }
  }

  const objectIdByNameSingular: Record<string, string> = {};

  for (const objectDef of objectDefs) {
    objectIdByNameSingular[objectDef.nameSingular] = objectDef.id;
  }

  return {
    flatObjectMetadataMaps,
    flatFieldMetadataMaps,
    flatViewMaps,
    objectIdByNameSingular,
  };
};

export const createBootstrapMocks = () => {
  const mockDataSourceService = {
    getLastDataSourceMetadataFromWorkspaceIdOrFail: jest
      .fn()
      .mockResolvedValue({
        id: 'ds-1',
      }),
  };

  const mockObjectMetadataService = {
    createOneObject: jest.fn().mockResolvedValue({ id: 'new-object-id' }),
    updateOneObject: jest.fn().mockResolvedValue(undefined),
  };

  const mockFieldMetadataService = {
    createManyFields: jest.fn().mockResolvedValue([]),
  };

  const mockViewService = {
    createOne: jest.fn().mockResolvedValue({ id: 'new-view-id' }),
  };

  const mockFlatEntityMapsCacheService = {
    invalidateFlatEntityMaps: jest.fn().mockResolvedValue(undefined),
    getOrRecomputeManyOrAllFlatEntityMaps: jest
      .fn()
      .mockResolvedValue(buildFakeFlatMaps([]).flatObjectMetadataMaps),
  };

  const mockViewFilterService = {
    createOne: jest.fn().mockResolvedValue({ id: 'new-view-filter-id' }),
  };

  const mockViewSortService = {
    createOne: jest.fn().mockResolvedValue({ id: 'new-view-sort-id' }),
  };

  const mockGlobalWorkspaceOrmManager = {
    getGlobalWorkspaceDataSource: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue([]),
    }),
  };

  const service = new PartnerOsMetadataBootstrapService(
    mockDataSourceService as any,
    mockObjectMetadataService as any,
    mockFieldMetadataService as any,
    mockViewService as any,
    mockViewFilterService as any,
    mockViewSortService as any,
    mockFlatEntityMapsCacheService as any,
    mockGlobalWorkspaceOrmManager as any,
  );

  return {
    service,
    mockDataSourceService,
    mockObjectMetadataService,
    mockFieldMetadataService,
    mockViewService,
    mockViewFilterService,
    mockViewSortService,
    mockFlatEntityMapsCacheService,
    mockGlobalWorkspaceOrmManager,
  };
};

// Helper to configure getFreshFlatMaps to return specific maps
export const configureFlatMapsReturn = (
  mockFlatEntityMapsCacheService: ReturnType<
    typeof createBootstrapMocks
  >['mockFlatEntityMapsCacheService'],
  objectDefs: FakeObjectDef[],
) => {
  const maps = buildFakeFlatMaps(objectDefs);

  mockFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps.mockResolvedValue(
    {
      flatObjectMetadataMaps: maps.flatObjectMetadataMaps,
      flatFieldMetadataMaps: maps.flatFieldMetadataMaps,
      flatViewMaps: maps.flatViewMaps,
    },
  );

  return maps;
};
