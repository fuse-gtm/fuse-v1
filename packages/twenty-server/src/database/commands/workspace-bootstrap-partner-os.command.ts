import { Logger } from '@nestjs/common';

import { Command, CommandRunner, Option } from 'nest-commander';
import { validate as isUuid } from 'uuid';

import { PartnerOsMetadataBootstrapService } from 'src/modules/partner-os/services/partner-os-metadata-bootstrap.service';

type WorkspaceBootstrapPartnerOsCommandOptions = {
  workspaceId: string;
};

@Command({
  name: 'workspace:bootstrap:partner-os',
  description:
    'Bootstrap Partner OS custom objects, relations, and views for a workspace',
})
export class WorkspaceBootstrapPartnerOsCommand extends CommandRunner {
  private readonly logger = new Logger(WorkspaceBootstrapPartnerOsCommand.name);

  constructor(
    private readonly partnerOsMetadataBootstrapService: PartnerOsMetadataBootstrapService,
  ) {
    super();
  }

  @Option({
    flags: '-w, --workspace-id <workspaceId>',
    description: 'Workspace id to bootstrap',
    required: true,
  })
  parseWorkspaceId(workspaceId: string): string {
    if (!isUuid(workspaceId)) {
      throw new Error(`Invalid workspace id: ${workspaceId}`);
    }

    return workspaceId;
  }

  async run(
    _passedParams: string[],
    options: WorkspaceBootstrapPartnerOsCommandOptions,
  ): Promise<void> {
    if (!options.workspaceId) {
      throw new Error('Missing required --workspace-id option');
    }

    await this.partnerOsMetadataBootstrapService.bootstrap(options.workspaceId);

    this.logger.log(
      `Partner OS metadata bootstrapped for workspace ${options.workspaceId}`,
    );
  }
}
