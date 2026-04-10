import { HealthIndicatorService } from '@nestjs/terminus';
import { Test, type TestingModule } from '@nestjs/testing';

import { PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES } from 'src/engine/core-modules/health/constants/process-pressure-health-error-messages.constants';
import { ProcessPressureHealthIndicator } from 'src/engine/core-modules/health/indicators/process-pressure.health';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

describe('ProcessPressureHealthIndicator', () => {
  let service: ProcessPressureHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPressureHealthIndicator,
        {
          provide: HealthIndicatorService,
          useValue: {
            check: jest.fn().mockReturnValue({
              up: jest.fn().mockImplementation((data) => ({
                processPressure: { status: 'up', ...data },
              })),
              down: jest.fn().mockImplementation((data) => ({
                processPressure: { status: 'down', ...data },
              })),
            }),
          },
        },
        {
          provide: TwentyConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'READINESS_MAX_RSS_MB':
                  return 1200;
                case 'READINESS_MAX_HEAP_USED_RATIO':
                  return 0.92;
                case 'READINESS_MAX_EVENT_LOOP_LAG_MS':
                  return 500;
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProcessPressureHealthIndicator>(
      ProcessPressureHealthIndicator,
    );
    service.onModuleInit();
  });

  afterEach(() => {
    service.onModuleDestroy();
    jest.restoreAllMocks();
  });

  it('returns up when RSS, heap ratio, and event loop lag are below thresholds', async () => {
    jest.spyOn(process, 'memoryUsage').mockReturnValue({
      rss: 600 * 1024 * 1024,
      heapUsed: 400 * 1024 * 1024,
      heapTotal: 600 * 1024 * 1024,
      external: 0,
      arrayBuffers: 0,
    });
    jest.spyOn(service as any, 'getEventLoopLagP99Ms').mockReturnValue(80);

    const result = await service.isHealthy();

    expect(result.processPressure.status).toBe('up');
  });

  it('returns down when RSS exceeds the threshold', async () => {
    jest.spyOn(process, 'memoryUsage').mockReturnValue({
      rss: 1300 * 1024 * 1024,
      heapUsed: 400 * 1024 * 1024,
      heapTotal: 600 * 1024 * 1024,
      external: 0,
      arrayBuffers: 0,
    });
    jest.spyOn(service as any, 'getEventLoopLagP99Ms').mockReturnValue(80);

    const result = await service.isHealthy();

    expect(result.processPressure.status).toBe('down');
    expect(result.processPressure.message).toContain(
      PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES.RSS_MEMORY_PRESSURE_HIGH,
    );
  });

  it('returns down when heap usage ratio exceeds the threshold', async () => {
    jest.spyOn(process, 'memoryUsage').mockReturnValue({
      rss: 600 * 1024 * 1024,
      heapUsed: 930 * 1024 * 1024,
      heapTotal: 1000 * 1024 * 1024,
      external: 0,
      arrayBuffers: 0,
    });
    jest.spyOn(service as any, 'getEventLoopLagP99Ms').mockReturnValue(80);

    const result = await service.isHealthy();

    expect(result.processPressure.status).toBe('down');
    expect(result.processPressure.message).toContain(
      PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES.HEAP_RATIO_PRESSURE_HIGH,
    );
  });

  it('returns down when event loop lag exceeds the threshold', async () => {
    jest.spyOn(process, 'memoryUsage').mockReturnValue({
      rss: 600 * 1024 * 1024,
      heapUsed: 400 * 1024 * 1024,
      heapTotal: 600 * 1024 * 1024,
      external: 0,
      arrayBuffers: 0,
    });
    jest.spyOn(service as any, 'getEventLoopLagP99Ms').mockReturnValue(650);

    const result = await service.isHealthy();

    expect(result.processPressure.status).toBe('down');
    expect(result.processPressure.message).toContain(
      PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES.EVENT_LOOP_LAG_HIGH,
    );
  });
});
