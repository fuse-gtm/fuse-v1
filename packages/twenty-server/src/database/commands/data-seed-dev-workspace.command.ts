import { Logger } from '@nestjs/common';

import { Command, CommandRunner, Option } from 'nest-commander';

import {
  SEED_APPLE_WORKSPACE_ID,
  SEED_YCOMBINATOR_WORKSPACE_ID,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { DevSeederService } from 'src/engine/workspace-manager/dev-seeder/services/dev-seeder.service';

type SeedWorkspaceProfile = 'apple' | 'yc';

type DataSeedWorkspaceCommandOptions = {
  workspaceId?: string;
  profile?: SeedWorkspaceProfile;
};

@Command({
  name: 'workspace:seed:dev',
  description:
    'Seed workspace with initial data. This command is intended for development only.',
})
export class DataSeedWorkspaceCommand extends CommandRunner {
  workspaceIds = [
    SEED_APPLE_WORKSPACE_ID,
    SEED_YCOMBINATOR_WORKSPACE_ID,
  ] as const;
  private readonly logger = new Logger(DataSeedWorkspaceCommand.name);
  private workspaceId?: string;
  private profile: SeedWorkspaceProfile = 'apple';

  constructor(private readonly devSeederService: DevSeederService) {
    super();
  }

  @Option({
    flags: '-w, --workspace-id [workspace_id]',
    description:
      'Seed an existing workspace by id (does not recreate workspace core records).',
    required: false,
  })
  parseWorkspaceId(val: string): string {
    this.workspaceId = val;

    return val;
  }

  @Option({
    flags: '-p, --profile [profile]',
    description:
      "Seed profile to use for existing workspace. Supported: 'apple' | 'yc'. Default: 'apple'.",
    required: false,
  })
  parseProfile(val: string): SeedWorkspaceProfile {
    if (val !== 'apple' && val !== 'yc') {
      throw new Error(`Invalid profile '${val}'. Use 'apple' or 'yc'.`);
    }

    this.profile = val;

    return val;
  }

  async run(
    _passedParams: string[],
    _options?: DataSeedWorkspaceCommandOptions,
  ): Promise<void> {
    try {
      if (this.workspaceId) {
        const profileWorkspaceId =
          this.profile === 'yc'
            ? SEED_YCOMBINATOR_WORKSPACE_ID
            : SEED_APPLE_WORKSPACE_ID;

        this.logger.log(
          `Seeding existing workspace ${this.workspaceId} with ${this.profile} profile`,
        );
        await this.devSeederService.seedExistingWorkspace({
          workspaceId: this.workspaceId,
          profileWorkspaceId,
        });

        return;
      }

      for (const workspaceId of this.workspaceIds) {
        await this.devSeederService.seedDev(workspaceId);
      }
    } catch (error) {
      this.logger.error(error);
      this.logger.error(error.stack);
    }
  }
}
