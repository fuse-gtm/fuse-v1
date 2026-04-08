import { Injectable } from '@nestjs/common';

import {
  type ExaSearchPayload,
  type PartnerCandidateEntityType,
  type RetrievalCheck,
} from 'src/modules/partner-os/types/partner-discovery.types';

const EXA_MAX_CHECKS_PER_RUN = 10;

@Injectable()
export class PartnerDiscoveryAdapterService {
  toExaSearchPayload({
    query,
    entityType,
    retrievalChecks,
    exclusions,
  }: {
    query: string;
    entityType: PartnerCandidateEntityType;
    retrievalChecks: RetrievalCheck[];
    exclusions: string[];
  }): ExaSearchPayload {
    const normalizedChecks = retrievalChecks
      .map((check) => check.prompt.trim())
      .filter((prompt) => prompt.length > 0);

    if (normalizedChecks.length > EXA_MAX_CHECKS_PER_RUN) {
      throw new Error(
        `Exa supports a maximum of ${EXA_MAX_CHECKS_PER_RUN} retrieval checks per run`,
      );
    }

    return {
      query: query.trim(),
      entity: {
        type: entityType,
      },
      criteria: normalizedChecks.map((description) => ({
        description,
      })),
      exclude: exclusions
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .map((value) => ({ value })),
    };
  }
}
