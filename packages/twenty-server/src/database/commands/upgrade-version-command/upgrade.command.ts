import { InjectRepository } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import { type Repository } from 'typeorm';

import { type ActiveOrSuspendedWorkspacesMigrationCommandOptions } from 'src/database/commands/command-runners/active-or-suspended-workspaces-migration.command-runner';
import {
  type AllCommands,
  UpgradeCommandRunner,
  type VersionCommands,
} from 'src/database/commands/command-runners/upgrade.command-runner';
import { BackfillApplicationPackageFilesCommand } from 'src/database/commands/upgrade-version-command/1-17/1-17-backfill-application-package-files.command';
import { DeleteFileRecordsAndUpdateTableCommand } from 'src/database/commands/upgrade-version-command/1-17/1-17-delete-all-files-and-update-table.command';
import { FixMorphRelationFieldNamesCommand } from 'src/database/commands/upgrade-version-command/1-17/1-17-fix-morph-relation-field-names.command';
import { IdentifyWebhookMetadataCommand } from 'src/database/commands/upgrade-version-command/1-17/1-17-identify-webhook-metadata.command';
import { MakeWebhookUniversalIdentifierAndApplicationIdNotNullableMigrationCommand } from 'src/database/commands/upgrade-version-command/1-17/1-17-make-webhook-universal-identifier-and-application-id-not-nullable-migration.command';
import { MigrateAttachmentToMorphRelationsCommand } from 'src/database/commands/upgrade-version-command/1-17/1-17-migrate-attachment-to-morph-relations.command';
import { MigrateNoteTargetToMorphRelationsCommand } from 'src/database/commands/upgrade-version-command/1-17/1-17-migrate-note-target-to-morph-relations.command';
import { MigrateTaskTargetToMorphRelationsCommand } from 'src/database/commands/upgrade-version-command/1-17/1-17-migrate-task-target-to-morph-relations.command';
import { BackfillFileSizeAndMimeTypeCommand } from 'src/database/commands/upgrade-version-command/1-18/1-18-backfill-file-size-and-mime-type.command';
import { BackfillMessageChannelThrottleRetryAfterCommand } from 'src/database/commands/upgrade-version-command/1-18/1-18-backfill-message-channel-throttle-retry-after.command';
import { BackfillStandardViewsAndFieldMetadataCommand } from 'src/database/commands/upgrade-version-command/1-18/1-18-backfill-standard-views-and-field-metadata.command';
import { DeleteOrphanFavoritesCommand } from 'src/database/commands/upgrade-version-command/1-18/1-18-delete-orphan-favorites.command';
import { MigrateActivityRichTextAttachmentFileIdsCommand } from 'src/database/commands/upgrade-version-command/1-18/1-18-migrate-activity-rich-text-attachment-file-ids.command';
import { MigrateAttachmentFilesCommand } from 'src/database/commands/upgrade-version-command/1-18/1-18-migrate-attachment-files.command';
import { MigrateFavoritesToNavigationMenuItemsCommand } from 'src/database/commands/upgrade-version-command/1-18/1-18-migrate-favorites-to-navigation-menu-items.command';
import { MigratePersonAvatarFilesCommand } from 'src/database/commands/upgrade-version-command/1-18/1-18-migrate-person-avatar-files.command';
import { MigrateWorkflowSendEmailAttachmentsCommand } from 'src/database/commands/upgrade-version-command/1-18/1-18-migrate-workflow-send-email-attachments.command';
import { MigrateWorkspacePicturesCommand } from 'src/database/commands/upgrade-version-command/1-18/1-18-migrate-workspace-pictures.command';
import { AddMissingSystemFieldsToStandardObjectsCommand } from 'src/database/commands/upgrade-version-command/1-19/1-19-add-missing-system-fields-to-standard-objects.command';
import { BackfillMessageChannelMessageAssociationMessageFolderCommand } from 'src/database/commands/upgrade-version-command/1-19/1-19-backfill-message-channel-message-association-message-folder.command';
import { BackfillMissingStandardViewsCommand } from 'src/database/commands/upgrade-version-command/1-19/1-19-backfill-missing-standard-views.command';
import { BackfillNavigationMenuItemTypeCommand } from 'src/database/commands/upgrade-version-command/1-19/1-19-backfill-navigation-menu-item-type.command';
import { BackfillSystemFieldsIsSystemCommand } from 'src/database/commands/upgrade-version-command/1-19/1-19-backfill-system-fields-is-system.command';
import { FixInvalidStandardUniversalIdentifiersCommand } from 'src/database/commands/upgrade-version-command/1-19/1-19-fix-invalid-standard-universal-identifiers.command';
import { SeedServerIdCommand } from 'src/database/commands/upgrade-version-command/1-19/1-19-seed-server-id.command';
import { BackfillCommandMenuItemsCommand } from 'src/database/commands/upgrade-version-command/1-20/1-20-backfill-command-menu-items.command';
import { BackfillPageLayoutsCommand } from 'src/database/commands/upgrade-version-command/1-20/1-20-backfill-page-layouts.command';
import { SeedCliApplicationRegistrationCommand } from 'src/database/commands/upgrade-version-command/1-20/1-20-seed-cli-application-registration.command';
import { UpdateStandardIndexViewNamesCommand } from 'src/database/commands/upgrade-version-command/1-20/1-20-update-standard-index-view-names.command';
import { AddGlobalKeyValuePairUniqueIndexCommand } from 'src/database/commands/upgrade-version-command/1-21/1-21-add-global-key-value-pair-unique-index.command';
import { BackfillDatasourceToWorkspaceCommand } from 'src/database/commands/upgrade-version-command/1-21/1-21-backfill-datasource-to-workspace.command';
import { BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand } from 'src/database/commands/upgrade-version-command/1-21/1-21-backfill-page-layouts-and-fields-widget-view-fields.command';
import { DeduplicateEngineCommandsCommand } from 'src/database/commands/upgrade-version-command/1-21/1-21-deduplicate-engine-commands.command';
import { FixSelectAllCommandMenuItemsCommand } from 'src/database/commands/upgrade-version-command/1-21/1-21-fix-select-all-command-menu-items.command';
import { MigrateAiAgentTextToJsonResponseFormatCommand } from 'src/database/commands/upgrade-version-command/1-21/1-21-migrate-ai-agent-text-to-json-response-format.command';
import { UpdateEditLayoutCommandMenuItemLabelCommand } from 'src/database/commands/upgrade-version-command/1-21/1-21-update-edit-layout-command-menu-item-label.command';
import { CoreEngineVersionService } from 'src/engine/core-engine-version/services/core-engine-version.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';

@Command({
  name: 'upgrade',
  description: 'Upgrade workspaces to the latest version',
})
export class UpgradeCommand extends UpgradeCommandRunner {
  override allCommands: AllCommands;

  constructor(
    @InjectRepository(WorkspaceEntity)
    protected readonly workspaceRepository: Repository<WorkspaceEntity>,
    protected readonly twentyConfigService: TwentyConfigService,
    protected readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    protected readonly dataSourceService: DataSourceService,

    // 1.17 Commands
    protected readonly backfillApplicationPackageFilesCommand: BackfillApplicationPackageFilesCommand,
    protected readonly deleteFileRecordsAndUpdateTableCommand: DeleteFileRecordsAndUpdateTableCommand,
    protected readonly migrateAttachmentToMorphRelationsCommand: MigrateAttachmentToMorphRelationsCommand,
    protected readonly migrateNoteTargetToMorphRelationsCommand: MigrateNoteTargetToMorphRelationsCommand,
    protected readonly migrateTaskTargetToMorphRelationsCommand: MigrateTaskTargetToMorphRelationsCommand,
    protected readonly identifyWebhookMetadataCommand: IdentifyWebhookMetadataCommand,
    protected readonly makeWebhookUniversalIdentifierAndApplicationIdNotNullableMigrationCommand: MakeWebhookUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
    protected readonly fixMorphRelationFieldNamesCommand: FixMorphRelationFieldNamesCommand,

    // 1.18 Commands
    protected readonly deleteOrphanFavoritesCommand: DeleteOrphanFavoritesCommand,
    protected readonly migrateFavoritesToNavigationMenuItemsCommand: MigrateFavoritesToNavigationMenuItemsCommand,
    protected readonly migratePersonAvatarFilesCommand: MigratePersonAvatarFilesCommand,
    protected readonly backfillFileSizeAndMimeTypeCommand: BackfillFileSizeAndMimeTypeCommand,
    protected readonly migrateAttachmentFilesCommand: MigrateAttachmentFilesCommand,
    protected readonly migrateActivityRichTextAttachmentFileIdsCommand: MigrateActivityRichTextAttachmentFileIdsCommand,
    protected readonly backfillMessageChannelThrottleRetryAfterCommand: BackfillMessageChannelThrottleRetryAfterCommand,
    protected readonly backfillStandardViewsAndFieldMetadataCommand: BackfillStandardViewsAndFieldMetadataCommand,
    protected readonly migrateWorkspacePicturesCommand: MigrateWorkspacePicturesCommand,
    protected readonly migrateWorkflowSendEmailAttachmentsCommand: MigrateWorkflowSendEmailAttachmentsCommand,

    // 1.19 Commands
    protected readonly backfillSystemFieldsIsSystemCommand: BackfillSystemFieldsIsSystemCommand,
    protected readonly addMissingSystemFieldsToStandardObjectsCommand: AddMissingSystemFieldsToStandardObjectsCommand,
    protected readonly backfillMessageChannelMessageAssociationMessageFolderCommand: BackfillMessageChannelMessageAssociationMessageFolderCommand,
    protected readonly backfillMissingStandardViewsCommand: BackfillMissingStandardViewsCommand,
    protected readonly backfillNavigationMenuItemTypeCommand: BackfillNavigationMenuItemTypeCommand,
    protected readonly fixRoleAndAgentUniversalIdentifiersCommand: FixInvalidStandardUniversalIdentifiersCommand,
    protected readonly seedServerIdCommand: SeedServerIdCommand,

    // 1.20 Commands
    private readonly identifyPermissionFlagMetadataCommand: IdentifyPermissionFlagMetadataCommand,
    private readonly makePermissionFlagUniversalIdentifierAndApplicationIdNotNullableMigrationCommand: MakePermissionFlagUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
    private readonly identifyObjectPermissionMetadataCommand: IdentifyObjectPermissionMetadataCommand,
    private readonly makeObjectPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand: MakeObjectPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
    private readonly identifyFieldPermissionMetadataCommand: IdentifyFieldPermissionMetadataCommand,
    private readonly makeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand: MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
    private readonly backfillNavigationMenuItemTypeCommand: BackfillNavigationMenuItemTypeCommand,
    private readonly backfillCommandMenuItemsCommand: BackfillCommandMenuItemsCommand,
    private readonly deleteOrphanNavigationMenuItemsCommand: DeleteOrphanNavigationMenuItemsCommand,
    private readonly seedCliApplicationRegistrationCommand: SeedCliApplicationRegistrationCommand,
    private readonly migrateRichTextToTextCommand: MigrateRichTextToTextCommand,
    private readonly migrateMessagingInfrastructureToMetadataCommand: MigrateMessagingInfrastructureToMetadataCommand,
    private readonly backfillSelectFieldOptionIdsCommand: BackfillSelectFieldOptionIdsCommand,
    private readonly updateStandardIndexViewNamesCommand: UpdateStandardIndexViewNamesCommand,
    private readonly makeWorkflowSearchableCommand: MakeWorkflowSearchableCommand,

    // 1.21 Commands
    private readonly addGlobalKeyValuePairUniqueIndexCommand: AddGlobalKeyValuePairUniqueIndexCommand,
    private readonly backfillDatasourceToWorkspaceCommand: BackfillDatasourceToWorkspaceCommand,
    private readonly backfillPageLayoutsAndFieldsWidgetViewFieldsCommand: BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand,
    private readonly deduplicateEngineCommandsCommand: DeduplicateEngineCommandsCommand,
    private readonly fixSelectAllCommandMenuItemsCommand: FixSelectAllCommandMenuItemsCommand,
    private readonly migrateAiAgentTextToJsonResponseFormatCommand: MigrateAiAgentTextToJsonResponseFormatCommand,
    private readonly updateEditLayoutCommandMenuItemLabelCommand: UpdateEditLayoutCommandMenuItemLabelCommand,
  ) {
    super(
      workspaceRepository,
      twentyConfigService,
      globalWorkspaceOrmManager,
      dataSourceService,
    );

    // Note: Required empty commands array to allow retrieving previous version
    const commands_1160: VersionCommands = [];

    const commands_1170: VersionCommands = [
      this.migrateAttachmentToMorphRelationsCommand,
      this.migrateNoteTargetToMorphRelationsCommand,
      this.migrateTaskTargetToMorphRelationsCommand,
      this.identifyWebhookMetadataCommand,
      this
        .makeWebhookUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
      this.deleteFileRecordsAndUpdateTableCommand,
      this.backfillApplicationPackageFilesCommand,
      this.fixMorphRelationFieldNamesCommand,
    ];

    const commands_1210: VersionCommands = [
      this.addGlobalKeyValuePairUniqueIndexCommand,
      this.backfillDatasourceToWorkspaceCommand,
      this.backfillPageLayoutsAndFieldsWidgetViewFieldsCommand,
      this.deduplicateEngineCommandsCommand,
      this.fixSelectAllCommandMenuItemsCommand,
      this.migrateAiAgentTextToJsonResponseFormatCommand,
      this.updateEditLayoutCommandMenuItemLabelCommand,
    ];

    this.allCommands = {
      '1.16.0': commands_1160,
      '1.17.0': commands_1170,
      '1.18.0': commands_1180,
      '1.19.0': commands_1190,
      '1.20.0': commands_1200,
    };
  }

  override async runMigrationCommand(
    passedParams: string[],
    options: ActiveOrSuspendedWorkspacesMigrationCommandOptions,
  ): Promise<void> {
    return await super.runMigrationCommand(passedParams, options);
  }
}
