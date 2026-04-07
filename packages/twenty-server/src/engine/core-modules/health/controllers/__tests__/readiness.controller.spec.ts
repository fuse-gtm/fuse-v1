import { HealthCheckService } from '@nestjs/terminus';
import { Test, type TestingModule } from '@nestjs/testing';

import { DatabaseHealthIndicator } from 'src/engine/core-modules/admin-panel/indicators/database.health';
import { RedisHealthIndicator } from 'src/engine/core-modules/admin-panel/indicators/redis.health';
import { ReadinessController } from 'src/engine/core-modules/health/controllers/readiness.controller';
import { ProcessPressureHealthIndicator } from 'src/engine/core-modules/health/indicators/process-pressure.health';

const mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return res as unknown as import('express').Response;
};

describe('ReadinessController', () => {
  let controller: ReadinessController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [ReadinessController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: DatabaseHealthIndicator,
          useValue: { isHealthy: jest.fn() },
        },
        {
          provide: RedisHealthIndicator,
          useValue: { isHealthy: jest.fn() },
        },
        {
          provide: ProcessPressureHealthIndicator,
          useValue: { isHealthy: jest.fn() },
        },
      ],
    }).compile();

    controller = testingModule.get<ReadinessController>(ReadinessController);
    healthCheckService =
      testingModule.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 200 when all checks pass', async () => {
    const res = mockResponse();
    const healthResult = { status: 'ok', details: {} };

    (healthCheckService.check as jest.Mock).mockResolvedValue(healthResult);

    await controller.check(res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(healthResult);
  });

  it('should return 503 when a check fails', async () => {
    const res = mockResponse();
    const error = {
      response: {
        status: 'error',
        details: { database: { status: 'down' } },
      },
    };

    (healthCheckService.check as jest.Mock).mockRejectedValue(error);

    await controller.check(res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(error.response);
  });
});
