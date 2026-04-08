import { Command, CommandRunner } from 'nest-commander';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import {
  STALE_HANDOFF_REMINDER_CRON_PATTERN,
  StaleHandoffReminderCronJob,
} from 'src/modules/partner-os/crons/jobs/stale-handoff-reminder.cron.job';

@Command({
  name: 'cron:stale-handoff-reminder',
  description:
    'Starts a daily cron job to flag partner customer maps stuck in INTRODUCED stage',
})
export class StaleHandoffReminderCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.cronQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.messageQueueService.addCron<undefined>({
      jobName: StaleHandoffReminderCronJob.name,
      data: undefined,
      options: {
        repeat: {
          pattern: STALE_HANDOFF_REMINDER_CRON_PATTERN,
        },
      },
    });
  }
}
