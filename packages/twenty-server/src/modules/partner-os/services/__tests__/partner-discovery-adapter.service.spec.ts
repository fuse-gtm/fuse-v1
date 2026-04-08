import { PartnerDiscoveryAdapterService } from 'src/modules/partner-os/services/partner-discovery-adapter.service';

import {
  buildExaInput,
  buildRetrievalCheck,
} from './fixtures/partner-os-test.fixtures';

describe('PartnerDiscoveryAdapterService', () => {
  let service: PartnerDiscoveryAdapterService;

  beforeEach(() => {
    service = new PartnerDiscoveryAdapterService();
  });

  describe('toExaSearchPayload', () => {
    describe('basic transformation', () => {
      it('should transform valid input into Exa Websets payload structure', () => {
        const result = service.toExaSearchPayload(buildExaInput());

        expect(result).toEqual({
          query: 'AI software startups',
          entity: { type: 'company' },
          criteria: [
            { description: 'Has a public API' },
            { description: 'Series A or later' },
          ],
          exclude: [{ value: 'competitor.com' }, { value: 'badfit.io' }],
        });
      });

      it('should set entity.type from entityType parameter', () => {
        const result = service.toExaSearchPayload(
          buildExaInput({ entityType: 'person' }),
        );

        expect(result.entity.type).toBe('person');
      });
    });

    describe('whitespace normalization', () => {
      it('should trim query', () => {
        const result = service.toExaSearchPayload(
          buildExaInput({ query: '  AI startups  ' }),
        );

        expect(result.query).toBe('AI startups');
      });

      it('should trim retrieval check prompts', () => {
        const result = service.toExaSearchPayload(
          buildExaInput({
            retrievalChecks: [buildRetrievalCheck({ prompt: '  Has API  ' })],
          }),
        );

        expect(result.criteria[0].description).toBe('Has API');
      });

      it('should trim exclusion values', () => {
        const result = service.toExaSearchPayload(
          buildExaInput({ exclusions: ['  competitor.com  '] }),
        );

        expect(result.exclude[0].value).toBe('competitor.com');
      });
    });

    describe('empty filtering', () => {
      it('should filter out checks with empty prompts after trim', () => {
        const result = service.toExaSearchPayload(
          buildExaInput({
            retrievalChecks: [
              buildRetrievalCheck({ prompt: 'Valid check' }),
              buildRetrievalCheck({ prompt: '   ' }),
              buildRetrievalCheck({ prompt: '' }),
            ],
          }),
        );

        expect(result.criteria).toHaveLength(1);
        expect(result.criteria[0].description).toBe('Valid check');
      });

      it('should filter out empty exclusion strings after trim', () => {
        const result = service.toExaSearchPayload(
          buildExaInput({
            exclusions: ['valid.com', '   ', ''],
          }),
        );

        expect(result.exclude).toHaveLength(1);
        expect(result.exclude[0].value).toBe('valid.com');
      });

      it('should return empty criteria when all prompts are empty', () => {
        const result = service.toExaSearchPayload(
          buildExaInput({
            retrievalChecks: [
              buildRetrievalCheck({ prompt: '' }),
              buildRetrievalCheck({ prompt: '   ' }),
            ],
          }),
        );

        expect(result.criteria).toEqual([]);
      });

      it('should return empty exclude when all exclusions are empty', () => {
        const result = service.toExaSearchPayload(
          buildExaInput({ exclusions: ['', '  '] }),
        );

        expect(result.exclude).toEqual([]);
      });
    });

    describe('max checks enforcement', () => {
      it('should accept exactly 10 retrieval checks', () => {
        const checks = Array.from({ length: 10 }, (_, i) =>
          buildRetrievalCheck({ id: `check-${i}`, prompt: `Check ${i}` }),
        );

        const result = service.toExaSearchPayload(
          buildExaInput({ retrievalChecks: checks }),
        );

        expect(result.criteria).toHaveLength(10);
      });

      it('should throw when more than 10 checks after filtering', () => {
        const checks = Array.from({ length: 11 }, (_, i) =>
          buildRetrievalCheck({ id: `check-${i}`, prompt: `Check ${i}` }),
        );

        expect(() =>
          service.toExaSearchPayload(
            buildExaInput({ retrievalChecks: checks }),
          ),
        ).toThrow('Exa supports a maximum of 10 retrieval checks per run');
      });

      it('should not count empty prompts toward the limit', () => {
        const validChecks = Array.from({ length: 10 }, (_, i) =>
          buildRetrievalCheck({ id: `check-${i}`, prompt: `Check ${i}` }),
        );

        const checksWithEmpty = [
          ...validChecks,
          buildRetrievalCheck({ id: 'empty-1', prompt: '' }),
          buildRetrievalCheck({ id: 'empty-2', prompt: '   ' }),
        ];

        const result = service.toExaSearchPayload(
          buildExaInput({ retrievalChecks: checksWithEmpty }),
        );

        // 10 valid + 2 empty = 12 input, but only 10 after filtering
        expect(result.criteria).toHaveLength(10);
      });
    });
  });
});
