import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  type HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';

import { monitorEventLoopDelay } from 'node:perf_hooks';

import { withHealthCheckTimeout } from 'src/engine/core-modules/admin-panel/utils/health-check-timeout.util';
import { PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES } from 'src/engine/core-modules/health/constants/process-pressure-health-error-messages.constants';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

const BYTES_IN_MEGABYTE = 1024 * 1024;

type ProcessPressureDetails = {
  system: {
    nodeVersion: string;
    pid: number;
    timestamp: string;
  };
  memory: {
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
    heapUsedRatio: number;
  };
  eventLoop: {
    lagP99Ms: number;
  };
  thresholds: {
    rssMb: number;
    heapUsedRatio: number;
    eventLoopLagMs: number;
  };
};

@Injectable()
export class ProcessPressureHealthIndicator
  implements OnModuleInit, OnModuleDestroy
{
  private readonly eventLoopDelayHistogram = monitorEventLoopDelay({
    resolution: 20,
  });

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  onModuleInit() {
    this.eventLoopDelayHistogram.enable();
  }

  onModuleDestroy() {
    this.eventLoopDelayHistogram.disable();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check('processPressure');

    try {
      const details = await withHealthCheckTimeout(
        Promise.resolve(this.getProcessPressureDetails()),
        PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES.PROCESS_PRESSURE_TIMEOUT,
      );
      const message = this.getFailureMessage(details);

      if (!message) {
        return indicator.up({ details });
      }

      return indicator.down({ message, details });
    } catch (error) {
      const message =
        error.message ===
        PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES.PROCESS_PRESSURE_TIMEOUT
          ? PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES.PROCESS_PRESSURE_TIMEOUT
          : PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES.PROCESS_PRESSURE_CHECK_FAILED;

      return indicator.down({
        message,
        details: {
          system: {
            nodeVersion: process.version,
            pid: process.pid,
            timestamp: new Date().toISOString(),
          },
        },
      });
    }
  }

  private getProcessPressureDetails(): ProcessPressureDetails {
    const memoryUsage = process.memoryUsage();
    const rssMb = this.toMegabytes(memoryUsage.rss);
    const heapUsedMb = this.toMegabytes(memoryUsage.heapUsed);
    const heapTotalMb = this.toMegabytes(memoryUsage.heapTotal);
    const heapUsedRatio =
      heapTotalMb === 0 ? 0 : this.round(memoryUsage.heapUsed / memoryUsage.heapTotal);

    return {
      system: {
        nodeVersion: process.version,
        pid: process.pid,
        timestamp: new Date().toISOString(),
      },
      memory: {
        rssMb,
        heapUsedMb,
        heapTotalMb,
        heapUsedRatio,
      },
      eventLoop: {
        lagP99Ms: this.getEventLoopLagP99Ms(),
      },
      thresholds: {
        rssMb: this.twentyConfigService.get('READINESS_MAX_RSS_MB'),
        heapUsedRatio: this.twentyConfigService.get(
          'READINESS_MAX_HEAP_USED_RATIO',
        ),
        eventLoopLagMs: this.twentyConfigService.get(
          'READINESS_MAX_EVENT_LOOP_LAG_MS',
        ),
      },
    };
  }

  private getFailureMessage(details: ProcessPressureDetails) {
    const messages: string[] = [];

    if (details.memory.rssMb > details.thresholds.rssMb) {
      messages.push(
        `${PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES.RSS_MEMORY_PRESSURE_HIGH} (${details.memory.rssMb}MB > ${details.thresholds.rssMb}MB)`,
      );
    }

    if (details.memory.heapUsedRatio > details.thresholds.heapUsedRatio) {
      messages.push(
        `${PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES.HEAP_RATIO_PRESSURE_HIGH} (${details.memory.heapUsedRatio} > ${details.thresholds.heapUsedRatio})`,
      );
    }

    if (details.eventLoop.lagP99Ms > details.thresholds.eventLoopLagMs) {
      messages.push(
        `${PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES.EVENT_LOOP_LAG_HIGH} (${details.eventLoop.lagP99Ms}ms > ${details.thresholds.eventLoopLagMs}ms)`,
      );
    }

    return messages.length > 0 ? messages.join('; ') : null;
  }

  private getEventLoopLagP99Ms() {
    const lagP99 = this.eventLoopDelayHistogram.percentile(99);
    const lagP99Ms = Number.isFinite(lagP99) ? lagP99 / 1e6 : 0;

    this.eventLoopDelayHistogram.reset();

    return this.round(lagP99Ms);
  }

  private toMegabytes(value: number) {
    return this.round(value / BYTES_IN_MEGABYTE);
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }
}
