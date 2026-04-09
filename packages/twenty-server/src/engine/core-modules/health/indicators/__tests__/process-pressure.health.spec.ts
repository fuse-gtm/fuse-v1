import { HealthIndicatorService } from '@nestjs/terminus';
import { Test, type TestingModule } from '@nestjs/testing';

import { ProcessPressureHealthIndicator } from 'src/engine/core-modules/health/indicators/process-pressure.health';

describe('ProcessPressureHealthIndicator', () => {
  let indicator: ProcessPressureHealthIndicator;

  beforeEach(async () => {
    const mockIndicatorService = {
      check: jest.fn().mockReturnValue({
        up: jest.fn((data) => ({
          'process-pressure': { status: 'up', ...data },
        })),
        down: jest.fn((data) => ({
          'process-pressure': { status: 'down', ...data },
        })),
      }),
    };

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPressureHealthIndicator,
        {
          provide: HealthIndicatorService,
          useValue: mockIndicatorService,
        },
      ],
    }).compile();

    indicator = testingModule.get<ProcessPressureHealthIndicator>(
      ProcessPressureHealthIndicator,
    );
  });

  it('should be defined', () => {
    expect(indicator).toBeDefined();
  });

  it('should return healthy under normal conditions', async () => {
    const result = await indicator.isHealthy();

    expect(result['process-pressure'].status).toBe('up');
  });
});
