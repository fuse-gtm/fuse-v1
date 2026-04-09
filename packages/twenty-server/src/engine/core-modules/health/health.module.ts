import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AdminPanelModule } from 'src/engine/core-modules/admin-panel/admin-panel.module';
import { HealthController } from 'src/engine/core-modules/health/controllers/health.controller';
import { ReadinessController } from 'src/engine/core-modules/health/controllers/readiness.controller';
import { ProcessPressureHealthIndicator } from 'src/engine/core-modules/health/indicators/process-pressure.health';

@Module({
  imports: [TerminusModule, AdminPanelModule],
  controllers: [HealthController, ReadinessController],
  providers: [ProcessPressureHealthIndicator],
})
export class HealthModule {}
