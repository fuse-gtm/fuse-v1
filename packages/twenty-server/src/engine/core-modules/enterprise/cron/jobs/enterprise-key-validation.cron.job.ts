/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IsNull, Repository } from 'typeorm';

import { SentryCronMonitor } from 'src/engine/core-modules/cron/sentry-cron-monitor.decorator';
import { ENTERPRISE_KEY_VALIDATION_CRON_PATTERN } from 'src/engine/core-modules/enterprise/constants/enterprise-key-validation-cron-pattern.constant';
import { EnterprisePlanService } from 'src/engine/core-modules/enterprise/services/enterprise-plan.service';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';

@Injectable()
@Processor(MessageQueue.cronQueue)
export class EnterpriseKeyValidationCronJob {
  private readonly logger = new Logger(EnterpriseKeyValidationCronJob.name);

  constructor(
    private readonly enterprisePlanService: EnterprisePlanService,
    @InjectRepository(UserWorkspaceEntity)
    private readonly userWorkspaceRepository: Repository<UserWorkspaceEntity>,
  ) {}

  @Process(EnterpriseKeyValidationCronJob.name)
  @SentryCronMonitor(
    EnterpriseKeyValidationCronJob.name,
    ENTERPRISE_KEY_VALIDATION_CRON_PATTERN,
  )
  async handle(): Promise<void> {
    // Fuse: phone-home disabled — enterprise features are always enabled
    this.logger.log(
      'Enterprise key validation cron skipped (Fuse self-hosted)',
    );
  }

  private async getActiveUserWorkspaceCount(): Promise<number> {
    const count = await this.userWorkspaceRepository.count({
      where: { deletedAt: IsNull() },
    });

    return Math.max(1, count);
  }
}
