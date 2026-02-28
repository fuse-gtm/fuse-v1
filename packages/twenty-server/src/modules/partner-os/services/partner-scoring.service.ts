import { Injectable } from '@nestjs/common';

import {
  type CandidateScore,
  type CandidateScoreInput,
  type CheckStatus,
} from 'src/modules/partner-os/types/partner-discovery.types';

@Injectable()
export class PartnerScoringService {
  scoreCandidate(input: CandidateScoreInput): CandidateScore {
    if (input.isExcluded) {
      return {
        fitScore: 0,
        confidence: 0,
        gateStatus: 'excluded',
        gateReason: 'Matched exclusion rule',
        availableWeight: 0,
        totalWeight: this.sumWeights(input),
        matchedCount: 0,
        contributionByCheckId: this.initializeContributionMap(input),
      };
    }

    const signalById = new Map(input.signals.map((signal) => [signal.id, signal]));
    const contributionByCheckId = this.initializeContributionMap(input);

    const totalWeight = this.sumWeights(input);

    let availableWeight = 0;
    let satisfiedWeight = 0;
    let matchedCount = 0;

    const failedMustPassSignals: string[] = [];

    for (const evaluation of input.evaluations) {
      const signal = signalById.get(evaluation.checkId);

      if (!signal) {
        continue;
      }

      if (evaluation.status !== 'Unclear') {
        availableWeight += signal.weight;
      }

      if (evaluation.status === 'Match') {
        satisfiedWeight += signal.weight;
        matchedCount += 1;
        contributionByCheckId[signal.id] = signal.weight;
      }

      if (
        signal.gateMode === 'must_pass' &&
        this.isNoMatch(evaluation.status)
      ) {
        failedMustPassSignals.push(signal.label);
      }
    }

    const fitScore =
      availableWeight > 0 ? (100 * satisfiedWeight) / availableWeight : 0;

    const confidence = totalWeight > 0 ? availableWeight / totalWeight : 0;

    if (failedMustPassSignals.length > 0) {
      return {
        fitScore,
        confidence,
        gateStatus: 'disqualified',
        gateReason: `Failed must-pass checks: ${failedMustPassSignals.join(', ')}`,
        availableWeight,
        totalWeight,
        matchedCount,
        contributionByCheckId,
      };
    }

    return {
      fitScore,
      confidence,
      gateStatus: 'qualified',
      gateReason: null,
      availableWeight,
      totalWeight,
      matchedCount,
      contributionByCheckId,
    };
  }

  private initializeContributionMap(
    input: CandidateScoreInput,
  ): Record<string, number> {
    return Object.fromEntries(
      input.signals.map((signal) => [signal.id, 0]),
    ) as Record<string, number>;
  }

  private sumWeights(input: CandidateScoreInput): number {
    return input.signals.reduce((sum, signal) => sum + signal.weight, 0);
  }

  private isNoMatch(status: CheckStatus): boolean {
    return status === 'No Match';
  }
}
