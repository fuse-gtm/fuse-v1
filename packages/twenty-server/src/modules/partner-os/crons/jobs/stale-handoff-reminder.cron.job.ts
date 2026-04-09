import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { Repository } from 'typeorm';

import { SentryCronMonitor } from 'src/engine/core-modules/cron/sentry-cron-monitor.decorator';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { getWorkspaceSchemaName } from 'src/engine/workspace-datasource/utils/get-workspace-schema-name.util';

export const STALE_HANDOFF_REMINDER_CRON_PATTERN = '0 9 * * *'; // Daily at 9 AM

const STALE_THRESHOLD_DAYS = 3;

@Processor(MessageQueue.cronQueue)
export class StaleHandoffReminderCronJob {
  private readonly logger = new Logger(StaleHandoffReminderCronJob.name);

  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  @Process(StaleHandoffReminderCronJob.name)
  @SentryCronMonitor(
    StaleHandoffReminderCronJob.name,
    STALE_HANDOFF_REMINDER_CRON_PATTERN,
  )
  async handle(): Promise<void> {
    const activeWorkspaces = await this.workspaceRepository.find({
      where: { activationStatus: WorkspaceActivationStatus.ACTIVE },
    });

    for (const workspace of activeWorkspaces) {
      try {
        await this.processWorkspace(workspace.id);
      } catch (error) {
        this.logger.error(
          `Failed to check stale handoffs for workspace ${workspace.id}: ${(error as Error).message}`,
        );
      }
    }
  }

  private async processWorkspace(workspaceId: string): Promise<void> {
    const schemaName = getWorkspaceSchemaName(workspaceId);
    const dataSource =
      await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource();

    const staleMaps: Array<{
      id: string;
      mapStage: string;
      updatedAt: string;
    }> = await dataSource.query(
      `SELECT "id", "mapStage", "updatedAt"
       FROM "${schemaName}"."_partnerCustomerMap"
       WHERE "mapStage" = 'INTRODUCED'
         AND "deletedAt" IS NULL
         AND "updatedAt" < NOW() - INTERVAL '${STALE_THRESHOLD_DAYS} days'`,
    );

    if (staleMaps.length === 0) {
      return;
    }

    this.logger.warn(
      `Workspace ${workspaceId}: ${staleMaps.length} partnerCustomerMap(s) stuck in INTRODUCED for >${STALE_THRESHOLD_DAYS} days: ${staleMaps.map((m) => m.id).join(', ')}`,
    );
  }
}
