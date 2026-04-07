// TODO: upstream cherry-pick stub - module not yet in fork
// Original command referenced:
//   - active-or-suspended-workspace.command-runner (fork uses active-or-suspended-workspaces-migration.command-runner)
//   - workspace-iterator.service (does not exist in fork)
//   - workspace.command-runner (fork uses workspaces-migration.command-runner)
//   - src/engine/core-modules/application/application.service (fork has /services/application.service)
//   - STANDARD_COMMAND_MENU_ITEMS constant (not yet in fork)
//   - flatCommandMenuItemMaps on WorkspaceCacheService (not yet in fork)
//   - conditionalAvailabilityExpression on FlatCommandMenuItem (not yet in fork)

import { InjectRepository } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import { type Repository } from 'typeorm';

import { ActiveOrSuspendedWorkspacesMigrationCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspaces-migration.command-runner';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspaces-migration.command-runner';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';

@Command({
  name: 'upgrade:1-21:fix-select-all-command-menu-items',
  description:
    'Fix delete/restore/destroy command menu items to work in select-all (exclusion) mode',
})
export class FixSelectAllCommandMenuItemsCommand extends ActiveOrSuspendedWorkspacesMigrationCommandRunner {
  constructor(
    @InjectRepository(WorkspaceEntity)
    protected readonly workspaceRepository: Repository<WorkspaceEntity>,
    protected readonly twentyORMGlobalManager: GlobalWorkspaceOrmManager,
    protected readonly dataSourceService: DataSourceService,
  ) {
    super(workspaceRepository, twentyORMGlobalManager, dataSourceService);
  }

  override async runOnWorkspace(_args: RunOnWorkspaceArgs): Promise<void> {
    this.logger.log(
      'Skipping fix-select-all-command-menu-items: not yet implemented in this fork',
    );
  }
}
