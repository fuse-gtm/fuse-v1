import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Command, CommandRunner, Option } from 'nest-commander';
import { DataSource } from 'typeorm';
import { validate as isUuid } from 'uuid';

import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
import { PARTNER_OS_SEED_TABLES } from 'src/modules/partner-os/constants/partner-os-seed-data.constant';
import { PartnerOsMetadataBootstrapService } from 'src/modules/partner-os/services/partner-os-metadata-bootstrap.service';

type PartnerOsSeedCommandOptions = {
  workspaceId: string;
};

@Command({
  name: 'partner-os:seed',
  description: 'Seed partner-os demo data',
})
export class PartnerOsSeedCommand extends CommandRunner {
  private readonly logger = new Logger(PartnerOsSeedCommand.name);

  constructor(
    private readonly partnerOsMetadataBootstrapService: PartnerOsMetadataBootstrapService,
    private readonly dataSourceService: DataSourceService,
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
  ) {
    super();
  }

  @Option({
    flags: '-w, --workspace-id <workspaceId>',
    description: 'Workspace id to seed',
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
    options: PartnerOsSeedCommandOptions,
  ): Promise<void> {
    if (!options.workspaceId) {
      throw new Error('Missing required --workspace-id option');
    }

    const { workspaceId } = options;

    // Step 1: Bootstrap metadata (objects, fields, relations, views)
    this.logger.log('Bootstrapping Partner OS metadata...');
    await this.partnerOsMetadataBootstrapService.bootstrap(workspaceId);
    this.logger.log('Metadata bootstrap complete.');

    // Step 2: Resolve workspace schema name
    const dataSource =
      await this.dataSourceService.getLastDataSourceMetadataFromWorkspaceIdOrFail(
        workspaceId,
      );

    const schemaName = dataSource.schema;

    if (!schemaName) {
      throw new Error(
        `No database schema found for workspace ${workspaceId}. Has the workspace been activated?`,
      );
    }

    this.logger.log(`Seeding demo data into schema "${schemaName}"...`);

    // Step 3: Insert seed records table by table inside a transaction
    await this.coreDataSource.transaction(async (entityManager) => {
      for (const tableConfig of PARTNER_OS_SEED_TABLES) {
        const { tableName, columns, records } = tableConfig;
        const qualifiedTable = `"${schemaName}"."${tableName}"`;

        if (records.length === 0) {
          continue;
        }

        // Build parameterized INSERT with ON CONFLICT DO NOTHING for idempotency
        const columnList = columns.map((c) => `"${c}"`).join(', ');

        for (const record of records) {
          const placeholders = columns
            .map((_col, idx) => `$${idx + 1}`)
            .join(', ');

          const values = columns.map((col) => {
            const value = record[col];

            // Serialize JSON objects for RAW_JSON columns
            if (value !== null && typeof value === 'object') {
              return JSON.stringify(value);
            }

            return value ?? null;
          });

          await entityManager.query(
            `INSERT INTO ${qualifiedTable} (${columnList}) VALUES (${placeholders}) ON CONFLICT ("id") DO NOTHING`,
            values,
          );
        }

        this.logger.log(
          `  Seeded ${records.length} record(s) into ${tableName}`,
        );
      }
    });

    this.logger.log(
      `Partner OS demo data seeded for workspace ${workspaceId}`,
    );
  }
}
