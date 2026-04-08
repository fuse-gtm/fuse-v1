import { Injectable, Logger } from '@nestjs/common';

import { type ObjectRecordUpdateEvent } from 'twenty-shared/database-events';

import { OnDatabaseBatchEvent } from 'src/engine/api/graphql/graphql-query-runner/decorators/on-database-batch-event.decorator';
import { DatabaseEventAction } from 'src/engine/api/graphql/graphql-query-runner/enums/database-event-action';
import { type GlobalWorkspaceDataSource } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-datasource';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { type WorkspaceEventBatch } from 'src/engine/workspace-event-emitter/types/workspace-event-batch.type';

// Stages that trigger lead creation / attribution
const HANDOFF_STAGES = new Set(['INTRODUCED', 'CO_SELL']);
const CLOSED_WON_STAGE = 'CLOSED_WON';

type PartnerCustomerMapRecord = {
  id: string;
  mapStage: string;
  motionType: string;
  partnerProfileId: string | null;
  customerCompanyId: string | null;
  opportunityId: string | null;
  ownerId: string | null;
};

@Injectable()
export class PartnerCustomerMapHandoffListener {
  private readonly logger = new Logger(
    PartnerCustomerMapHandoffListener.name,
  );

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  @OnDatabaseBatchEvent('partnerCustomerMap', DatabaseEventAction.UPDATED)
  async handlePartnerCustomerMapUpdate(
    payload: WorkspaceEventBatch<
      ObjectRecordUpdateEvent<PartnerCustomerMapRecord>
    >,
  ) {
    const { events } = payload;

    for (const event of events) {
      const before = event.properties.before;
      const after = event.properties.after;

      if (before.mapStage === after.mapStage) {
        continue;
      }

      try {
        if (HANDOFF_STAGES.has(after.mapStage)) {
          await this.handleHandoffStageTransition(after);
        } else if (after.mapStage === CLOSED_WON_STAGE) {
          await this.handleClosedWon(after);
        }
      } catch (error) {
        this.logger.error(
          `Failed to process handoff for partnerCustomerMap ${after.id}: ${(error as Error).message}`,
        );
      }
    }
  }

  private async handleHandoffStageTransition(
    map: PartnerCustomerMapRecord,
  ) {
    const dataSource =
      await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource();

    // Check for existing active lead for this partner+company
    const existingLeads = await dataSource.query(
      `SELECT id FROM "_lead"
       WHERE "partnerProfileId" = $1
         AND "deletedAt" IS NULL
       LIMIT 1`,
      [map.partnerProfileId],
    );

    const now = new Date().toISOString();

    if (existingLeads.length === 0 && map.partnerProfileId) {
      // Create new lead
      const leadId = crypto.randomUUID();

      await dataSource.query(
        `INSERT INTO "_lead" (
          "id", "sourceType", "status", "partnerProfileId",
          "ownerId", "createdAt", "updatedAt", "deletedAt", "position"
        ) VALUES ($1, $2, $3, $4, $5, $6, $6, NULL, 1.0)`,
        [
          leadId,
          'PARTNER_SOURCED',
          'NEW',
          map.partnerProfileId,
          map.ownerId,
          now,
        ],
      );

      this.logger.log(
        `Created lead ${leadId} from partnerCustomerMap ${map.id} handoff`,
      );
    }

    // Create attribution event
    await this.createAttributionEvent(dataSource, {
      eventType: 'INTRODUCED',
      partnerProfileId: map.partnerProfileId,
      sourceObjectType: 'partnerCustomerMap',
      sourceObjectId: map.id,
      occurredAt: now,
    });

    this.logger.log(
      `Handoff processed for partnerCustomerMap ${map.id} → stage ${map.mapStage}`,
    );
  }

  private async handleClosedWon(map: PartnerCustomerMapRecord) {
    const dataSource =
      await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource();

    const now = new Date().toISOString();

    // Create SOURCED attribution event
    await this.createAttributionEvent(dataSource, {
      eventType: 'SOURCED',
      partnerProfileId: map.partnerProfileId,
      sourceObjectType: 'partnerCustomerMap',
      sourceObjectId: map.id,
      occurredAt: now,
    });

    this.logger.log(
      `Closed-won attribution recorded for partnerCustomerMap ${map.id}`,
    );
  }

  private async createAttributionEvent(
    dataSource: GlobalWorkspaceDataSource,
    params: {
      eventType: string;
      partnerProfileId: string | null;
      sourceObjectType: string;
      sourceObjectId: string;
      occurredAt: string;
    },
  ) {
    const eventId = crypto.randomUUID();

    await dataSource.query(
      `INSERT INTO "_partnerAttributionEvent" (
        "id", "eventType", "occurredAt", "sourceObjectType", "sourceObjectId",
        "partnerProfileId", "createdAt", "updatedAt", "deletedAt", "position"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $7, NULL, 1.0)`,
      [
        eventId,
        params.eventType,
        params.occurredAt,
        params.sourceObjectType,
        params.sourceObjectId,
        params.partnerProfileId,
        params.occurredAt,
      ],
    );
  }
}
