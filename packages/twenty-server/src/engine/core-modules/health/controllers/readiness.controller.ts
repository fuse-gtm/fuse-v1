import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { HealthCheckService } from '@nestjs/terminus';

import { type Response } from 'express';

import { DatabaseHealthIndicator } from 'src/engine/core-modules/admin-panel/indicators/database.health';
import { RedisHealthIndicator } from 'src/engine/core-modules/admin-panel/indicators/redis.health';
import { ProcessPressureHealthIndicator } from 'src/engine/core-modules/health/indicators/process-pressure.health';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';

@Controller('readyz')
export class ReadinessController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dbHealth: DatabaseHealthIndicator,
    private readonly redisHealth: RedisHealthIndicator,
    private readonly pressureHealth: ProcessPressureHealthIndicator,
  ) {}

  @Get()
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async check(@Res() res: Response) {
    try {
      const result = await this.health.check([
        () => this.dbHealth.isHealthy(),
        () => this.redisHealth.isHealthy(),
        () => this.pressureHealth.isHealthy(),
      ]);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(503).json(error.response || { status: 'error' });
    }
  }
}
