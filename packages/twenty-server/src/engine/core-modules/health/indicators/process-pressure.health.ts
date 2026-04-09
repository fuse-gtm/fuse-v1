import { Injectable } from '@nestjs/common';
import {
  type HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';

// Thresholds configurable via env vars
const MAX_RSS_MB = parseInt(process.env.READINESS_MAX_RSS_MB || '1280', 10);
const MAX_HEAP_USED_RATIO = parseFloat(
  process.env.READINESS_MAX_HEAP_USED_RATIO || '0.85',
);
const MAX_EVENT_LOOP_LAG_MS = parseInt(
  process.env.READINESS_MAX_EVENT_LOOP_LAG_MS || '500',
  10,
);

@Injectable()
export class ProcessPressureHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check('process-pressure');

    const memUsage = process.memoryUsage();
    const rssMb = Math.round(memUsage.rss / 1024 / 1024);
    const heapUsedRatio = memUsage.heapUsed / memUsage.heapTotal;
    const eventLoopLag = await this.measureEventLoopLag();

    const details = {
      rss: {
        currentMb: rssMb,
        maxMb: MAX_RSS_MB,
        ok: rssMb < MAX_RSS_MB,
      },
      heap: {
        usedRatio: Math.round(heapUsedRatio * 100) / 100,
        maxRatio: MAX_HEAP_USED_RATIO,
        ok: heapUsedRatio < MAX_HEAP_USED_RATIO,
      },
      eventLoop: {
        lagMs: eventLoopLag,
        maxMs: MAX_EVENT_LOOP_LAG_MS,
        ok: eventLoopLag < MAX_EVENT_LOOP_LAG_MS,
      },
    };

    const isHealthy =
      details.rss.ok && details.heap.ok && details.eventLoop.ok;

    if (isHealthy) {
      return indicator.up({ details });
    }

    return indicator.down({
      message: 'Process pressure exceeds configured thresholds',
      details,
    });
  }

  private measureEventLoopLag(): Promise<number> {
    const start = performance.now();

    return new Promise((resolve) => {
      setImmediate(() => {
        resolve(Math.round(performance.now() - start));
      });
    });
  }
}
