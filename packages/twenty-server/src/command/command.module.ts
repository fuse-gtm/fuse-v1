import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppModule } from 'src/app.module';
import { DatabaseCommandModule } from 'src/database/commands/database-command.module';
import { RunInstanceCommandsCommand } from 'src/database/commands/run-instance-commands.command';
import { TypeORMModule } from 'src/database/typeorm/typeorm.module';
import { CacheStorageModule } from 'src/engine/core-modules/cache-storage/cache-storage.module';
import { EnvironmentModule } from 'src/engine/core-modules/environment/environment.module';
import { ExceptionHandlerModule } from 'src/engine/core-modules/exception-handler/exception-handler.module';
import { ExceptionHandlerDriver } from 'src/engine/core-modules/exception-handler/interfaces';
import { FileStorageModule } from 'src/engine/core-modules/file-storage/file-storage.module';
import { LoggerDriverType } from 'src/engine/core-modules/logger/interfaces';
import { LoggerModule } from 'src/engine/core-modules/logger/logger.module';
import { MessageQueueDriverType } from 'src/engine/core-modules/message-queue/interfaces';
import { MessageQueueModule } from 'src/engine/core-modules/message-queue/message-queue.module';
import { TwentyConfigModule } from 'src/engine/core-modules/twenty-config/twenty-config.module';
import { UpgradeModule } from 'src/engine/core-modules/upgrade/upgrade.module';
import { FieldMetadataModule } from 'src/engine/metadata-modules/field-metadata/field-metadata.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { GlobalWorkspaceDataSourceModule } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-datasource.module';
import { WorkspaceCleanerModule } from 'src/engine/workspace-manager/workspace-cleaner/workspace-cleaner.module';
import { WorkspaceVersionModule } from 'src/engine/workspace-manager/workspace-version/workspace-version.module';
import { MessagingMessageCleanerModule } from 'src/modules/messaging/message-cleaner/messaging-message-cleaner.module';

const isRunInstanceCommandsCommand = process.argv.includes(
  'run-instance-commands',
);

const isCacheFlushCommand = process.argv.includes('cache:flush');

const baseCommandImports = [
  EnvironmentModule,
  TwentyConfigModule.forRoot(),
  LoggerModule.forRoot({
    type: LoggerDriverType.CONSOLE,
  }),
  ExceptionHandlerModule.forRoot({
    type: ExceptionHandlerDriver.CONSOLE,
  }),
  TypeORMModule,
];

const runInstanceCommandsImports = [
  EventEmitterModule.forRoot({
    wildcard: true,
  }),
  ...baseCommandImports,
  MessageQueueModule.register({
    type: MessageQueueDriverType.Sync,
    options: {},
  }),
  FileStorageModule.forRoot(),
  GlobalWorkspaceDataSourceModule,
  WorkspaceVersionModule,
  UpgradeModule,
];

const cacheFlushCommandImports = [...baseCommandImports, CacheStorageModule];

const defaultCommandImports = [
  AppModule,
  DatabaseCommandModule,
  MessagingMessageCleanerModule,
  ObjectMetadataModule,
  FieldMetadataModule,
  WorkspaceCleanerModule,
];

@Module({
  imports: isRunInstanceCommandsCommand
    ? runInstanceCommandsImports
    : isCacheFlushCommand
      ? cacheFlushCommandImports
      : defaultCommandImports,
  providers: isRunInstanceCommandsCommand ? [RunInstanceCommandsCommand] : [],
})
export class CommandModule {}
