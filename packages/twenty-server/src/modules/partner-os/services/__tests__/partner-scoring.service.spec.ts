import { PartnerScoringService } from 'src/modules/partner-os/services/partner-scoring.service';

import {
  buildEvaluation,
  buildScoreInput,
  buildSignal,
} from './fixtures/partner-os-test.fixtures';

describe('PartnerScoringService', () => {
  let service: PartnerScoringService;

  beforeEach(() => {
    service = new PartnerScoringService();
  });

  describe('scoreCandidate', () => {
    describe('excluded candidates', () => {
      it('should return zero scores and gateStatus=excluded when isExcluded is true', () => {
        const result = service.scoreCandidate(
          buildScoreInput({ isExcluded: true }),
        );

        expect(result.fitScore).toBe(0);
        expect(result.confidence).toBe(0);
        expect(result.gateStatus).toBe('excluded');
        expect(result.gateReason).toBe('Matched exclusion rule');
        expect(result.matchedCount).toBe(0);
        expect(result.availableWeight).toBe(0);
      });

      it('should compute totalWeight from signals even when excluded', () => {
        const result = service.scoreCandidate(
          buildScoreInput({ isExcluded: true }),
        );

        // Default signals: weight 10 + weight 20 = 30
        expect(result.totalWeight).toBe(30);
      });
    });

    describe('basic scoring', () => {
      it('should return fitScore=100 when all evaluations match', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            evaluations: [
              buildEvaluation({ checkId: 'signal-1', status: 'Match' }),
              buildEvaluation({ checkId: 'signal-2', status: 'Match' }),
            ],
          }),
        );

        expect(result.fitScore).toBe(100);
        expect(result.matchedCount).toBe(2);
      });

      it('should return partial fitScore when some evaluations match', () => {
        // Default input: signal-1 (weight 10) matches, signal-2 (weight 20) no match
        // fitScore = 100 * 10 / (10 + 20) = 33.33...
        const result = service.scoreCandidate(buildScoreInput());

        expect(result.fitScore).toBeCloseTo(33.33, 1);
        expect(result.matchedCount).toBe(1);
      });

      it('should exclude Unclear evaluations from availableWeight', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            evaluations: [
              buildEvaluation({ checkId: 'signal-1', status: 'Match' }),
              buildEvaluation({ checkId: 'signal-2', status: 'Unclear' }),
            ],
          }),
        );

        // Only signal-1 (weight 10) contributes to availableWeight
        expect(result.availableWeight).toBe(10);
        expect(result.totalWeight).toBe(30);
        expect(result.fitScore).toBe(100);
      });

      it('should skip evaluations whose checkId has no matching signal', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            evaluations: [
              buildEvaluation({ checkId: 'signal-1', status: 'Match' }),
              buildEvaluation({ checkId: 'unknown-signal', status: 'Match' }),
            ],
          }),
        );

        expect(result.matchedCount).toBe(1);
        expect(result.availableWeight).toBe(10);
      });
    });

    describe('gate logic', () => {
      it('should return disqualified when must_pass signal has No Match', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            signals: [
              buildSignal({
                id: 'gate-1',
                label: 'SOC2 Certified',
                weight: 10,
                gateMode: 'must_pass',
              }),
            ],
            evaluations: [
              buildEvaluation({ checkId: 'gate-1', status: 'No Match' }),
            ],
          }),
        );

        expect(result.gateStatus).toBe('disqualified');
        expect(result.gateReason).toContain('SOC2 Certified');
      });

      it('should list all failed must_pass labels in gateReason', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            signals: [
              buildSignal({
                id: 'gate-1',
                label: 'SOC2 Certified',
                weight: 10,
                gateMode: 'must_pass',
              }),
              buildSignal({
                id: 'gate-2',
                label: 'GDPR Compliant',
                weight: 10,
                gateMode: 'must_pass',
              }),
            ],
            evaluations: [
              buildEvaluation({ checkId: 'gate-1', status: 'No Match' }),
              buildEvaluation({ checkId: 'gate-2', status: 'No Match' }),
            ],
          }),
        );

        expect(result.gateStatus).toBe('disqualified');
        expect(result.gateReason).toBe(
          'Failed must-pass checks: SOC2 Certified, GDPR Compliant',
        );
      });

      it('should return qualified when must_pass signal has Match', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            signals: [
              buildSignal({
                id: 'gate-1',
                label: 'SOC2 Certified',
                weight: 10,
                gateMode: 'must_pass',
              }),
            ],
            evaluations: [
              buildEvaluation({ checkId: 'gate-1', status: 'Match' }),
            ],
          }),
        );

        expect(result.gateStatus).toBe('qualified');
        expect(result.gateReason).toBeNull();
      });

      it('should return qualified when must_pass signal has Unclear', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            signals: [
              buildSignal({
                id: 'gate-1',
                label: 'SOC2 Certified',
                weight: 10,
                gateMode: 'must_pass',
              }),
            ],
            evaluations: [
              buildEvaluation({ checkId: 'gate-1', status: 'Unclear' }),
            ],
          }),
        );

        // Unclear is not a failure for must_pass
        expect(result.gateStatus).toBe('qualified');
      });

      it('should still compute fitScore even when disqualified', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            signals: [
              buildSignal({
                id: 'gate-1',
                label: 'Required Gate',
                weight: 10,
                gateMode: 'must_pass',
              }),
              buildSignal({
                id: 'signal-1',
                label: 'Nice to Have',
                weight: 20,
              }),
            ],
            evaluations: [
              buildEvaluation({ checkId: 'gate-1', status: 'No Match' }),
              buildEvaluation({ checkId: 'signal-1', status: 'Match' }),
            ],
          }),
        );

        expect(result.gateStatus).toBe('disqualified');
        // fitScore = 100 * 20 / (10 + 20) = 66.67
        expect(result.fitScore).toBeCloseTo(66.67, 1);
      });
    });

    describe('confidence calculation', () => {
      it('should return confidence as ratio of available to total weight', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            signals: [
              buildSignal({ id: 'signal-1', weight: 10 }),
              buildSignal({ id: 'signal-2', weight: 20 }),
              buildSignal({ id: 'signal-3', weight: 30 }),
            ],
            evaluations: [
              buildEvaluation({ checkId: 'signal-1', status: 'Match' }),
              buildEvaluation({ checkId: 'signal-2', status: 'No Match' }),
              // signal-3 has no evaluation — not counted in available
            ],
          }),
        );

        // availableWeight = 10 + 20 = 30, totalWeight = 60
        expect(result.confidence).toBeCloseTo(0.5, 2);
      });
    });

    describe('contribution tracking', () => {
      it('should record weight for matched signals in contributionByCheckId', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            signals: [
              buildSignal({ id: 'signal-1', weight: 10 }),
              buildSignal({ id: 'signal-2', weight: 20 }),
            ],
            evaluations: [
              buildEvaluation({ checkId: 'signal-1', status: 'Match' }),
              buildEvaluation({ checkId: 'signal-2', status: 'No Match' }),
            ],
          }),
        );

        expect(result.contributionByCheckId['signal-1']).toBe(10);
        expect(result.contributionByCheckId['signal-2']).toBe(0);
      });

      it('should initialize all signal IDs to zero in contribution map', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            signals: [
              buildSignal({ id: 'signal-1', weight: 10 }),
              buildSignal({ id: 'signal-2', weight: 20 }),
              buildSignal({ id: 'signal-3', weight: 30 }),
            ],
            evaluations: [],
          }),
        );

        expect(result.contributionByCheckId).toEqual({
          'signal-1': 0,
          'signal-2': 0,
          'signal-3': 0,
        });
      });
    });

    describe('edge cases', () => {
      it('should return fitScore=0 when availableWeight is zero', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            signals: [buildSignal({ id: 'signal-1', weight: 10 })],
            evaluations: [
              buildEvaluation({ checkId: 'signal-1', status: 'Unclear' }),
            ],
          }),
        );

        // All unclear → availableWeight = 0 → no division by zero
        expect(result.fitScore).toBe(0);
      });

      it('should return confidence=0 when totalWeight is zero', () => {
        const result = service.scoreCandidate(
          buildScoreInput({
            signals: [],
            evaluations: [],
          }),
        );

        expect(result.confidence).toBe(0);
        expect(result.totalWeight).toBe(0);
      });

      it('should handle empty evaluations array', () => {
        const result = service.scoreCandidate(
          buildScoreInput({ evaluations: [] }),
        );

        expect(result.fitScore).toBe(0);
        expect(result.availableWeight).toBe(0);
        expect(result.matchedCount).toBe(0);
        expect(result.gateStatus).toBe('qualified');
      });

      it('should handle empty signals array', () => {
        const result = service.scoreCandidate(buildScoreInput({ signals: [] }));

        expect(result.fitScore).toBe(0);
        expect(result.totalWeight).toBe(0);
        expect(result.gateStatus).toBe('qualified');
      });
    });
  });
});
