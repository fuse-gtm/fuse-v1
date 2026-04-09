import { Injectable, Logger } from '@nestjs/common';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { getWorkspaceSchemaName } from 'src/engine/workspace-datasource/utils/get-workspace-schema-name.util';
import { PartnerDiscoveryAdapterService } from 'src/modules/partner-os/services/partner-discovery-adapter.service';
import { PartnerScoringService } from 'src/modules/partner-os/services/partner-scoring.service';
import { ExaClientService } from 'src/modules/partner-os/services/exa-client.service';
import {
  type ExaWebhookIdleEvent,
  type ExaWebhookItemEvent,
  type ExaWebhookSearchCompletedEvent,
  type ExaCreateWebsetRequest,
} from 'src/modules/partner-os/types/exa-webhook.types';
import {
  type PartnerCandidateEntityType,
  type RetrievalCheck,
  type RankingSignal,
  type CheckEvaluation,
} from 'src/modules/partner-os/types/partner-discovery.types';

type DiscoveryRunRow = {
  id: string;
  exaWebsetId: string;
  partnerTrackId: string;
  status: string;
};

type PartnerTrackRow = {
  id: string;
  entityType: string;
};

type TrackCheckRow = {
  id: string;
  prompt: string;
  label: string;
  weight: number;
  gateMode: string;
};

type TrackExclusionRow = {
  id: string;
  value: string;
};

type PartnerCandidateRow = {
  id: string;
  discoveryRunId: string;
};

type CheckEvaluationRow = {
  id: string;
  trackCheckId: string;
  status: string;
  reasoningMd: string | null;
  sources: string | null;
};

@Injectable()
export class PartnerDiscoveryOrchestratorService {
  private readonly logger = new Logger(
    PartnerDiscoveryOrchestratorService.name,
  );

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly adapterService: PartnerDiscoveryAdapterService,
    private readonly scoringService: PartnerScoringService,
    private readonly exaClientService: ExaClientService,
  ) {}

  // Workflow 1: Discovery initiation
  async initiateDiscovery(
    workspaceId: string,
    partnerTrackId: string,
    userId: string,
  ): Promise<{ discoveryRunId: string; websetId: string }> {
    const schemaName = getWorkspaceSchemaName(workspaceId);
    const dataSource =
      await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource();

    // Load partner track
    const trackRows = await dataSource.query(
      `SELECT "id", "entityType" FROM "${schemaName}"."_partnerTrack"
       WHERE "id" = $1 AND "deletedAt" IS NULL`,
      [partnerTrackId],
    );

    if (trackRows.length === 0) {
      throw new Error(`Partner track ${partnerTrackId} not found`);
    }

    const track: PartnerTrackRow = trackRows[0];

    // Load track checks
    const checkRows: TrackCheckRow[] = await dataSource.query(
      `SELECT "id", "prompt", "label", "weight", "gateMode"
       FROM "${schemaName}"."_trackCheck"
       WHERE "partnerTrackId" = $1 AND "deletedAt" IS NULL
       ORDER BY "position" ASC`,
      [partnerTrackId],
    );

    // Load exclusions
    const exclusionRows: TrackExclusionRow[] = await dataSource.query(
      `SELECT "id", "value"
       FROM "${schemaName}"."_trackExclusion"
       WHERE "partnerTrackId" = $1 AND "deletedAt" IS NULL`,
      [partnerTrackId],
    );

    // Build Exa payload using adapter
    const retrievalChecks: RetrievalCheck[] = checkRows.map((check) => ({
      id: check.id,
      prompt: check.prompt,
    }));

    const exaSearchPayload = this.adapterService.toExaSearchPayload({
      query: track.entityType === 'COMPANY' ? 'companies' : 'people',
      entityType: (track.entityType === 'COMPANY'
        ? 'company'
        : 'person') as PartnerCandidateEntityType,
      retrievalChecks,
      exclusions: exclusionRows.map((exclusion) => exclusion.value),
    });

    // Create discovery run record
    const now = new Date().toISOString();
    const discoveryRunId = crypto.randomUUID();

    await dataSource.query(
      `INSERT INTO "${schemaName}"."_discoveryRun" (
        "id", "queryRaw", "queryOptimized", "exaWebsetId", "status",
        "resultCount", "startedAt", "partnerTrackId", "createdByMemberId",
        "createdAt", "updatedAt", "deletedAt", "position"
      ) VALUES ($1, $2, $2, NULL, $3, 0, $4, $5, $6, $4, $4, NULL, 1.0)`,
      [
        discoveryRunId,
        exaSearchPayload.query,
        'PENDING',
        now,
        partnerTrackId,
        userId,
      ],
    );

    // Build webhook URL
    const serverUrl = process.env.SERVER_URL ?? 'http://localhost:3000';
    const webhookUrl = `${serverUrl}/partner-os/exa-webhook`;
    const webhookSecret = process.env.EXA_WEBHOOK_SECRET;

    // Call Exa API to create webset
    const createRequest: ExaCreateWebsetRequest = {
      search: {
        query: exaSearchPayload.query,
        entity: exaSearchPayload.entity,
        criteria: exaSearchPayload.criteria,
      },
      webhookUrl,
      ...(webhookSecret ? { webhookSecret } : {}),
    };

    const websetResponse =
      await this.exaClientService.createWebset(createRequest);

    // Update discovery run with webset ID and streaming status
    await dataSource.query(
      `UPDATE "${schemaName}"."_discoveryRun"
       SET "exaWebsetId" = $1, "status" = $2, "updatedAt" = $3
       WHERE "id" = $4`,
      [
        websetResponse.id,
        'STREAMING',
        new Date().toISOString(),
        discoveryRunId,
      ],
    );

    this.logger.log(
      `Discovery run ${discoveryRunId} initiated with webset ${websetResponse.id}`,
    );

    return { discoveryRunId, websetId: websetResponse.id };
  }

  // Workflow 2: Candidate ingestion from webhook
  async handleItemCreated(event: ExaWebhookItemEvent): Promise<void> {
    const item = event.data.item;
    const websetId = item.websetId;

    // Find the discovery run and workspace for this webset
    const { discoveryRun, schemaName, dataSource } =
      await this.findDiscoveryRunByWebsetId(websetId);

    if (!discoveryRun) {
      this.logger.warn(
        `No discovery run found for webset ${websetId}, ignoring item ${item.id}`,
      );

      return;
    }

    const now = new Date().toISOString();
    const candidateId = crypto.randomUUID();

    // Extract domain from URL
    let companyDomain = '';

    try {
      companyDomain = new URL(item.url).hostname.replace(/^www\./, '');
    } catch {
      // URL parsing failed, leave domain empty
    }

    // Upsert partner candidate
    await dataSource.query(
      `INSERT INTO "${schemaName}"."_partnerCandidate" (
        "id", "entityUrl", "entityType", "displayName", "companyDomain",
        "fitScore", "confidence", "gateStatus", "gateReason", "receivedAt",
        "discoveryRunId", "createdAt", "updatedAt", "deletedAt", "position"
      ) VALUES ($1, $2, $3, $4, $5, 0, 0, NULL, NULL, $6, $7, $6, $6, NULL, 1.0)
      ON CONFLICT ("entityUrl", "discoveryRunId")
        WHERE "deletedAt" IS NULL
        DO UPDATE SET "displayName" = $4, "updatedAt" = $6`,
      [
        candidateId,
        item.url,
        'COMPANY',
        item.title || item.url,
        companyDomain,
        now,
        discoveryRun.id,
      ],
    );

    // Load track checks for this discovery run's partner track
    const checkRows: TrackCheckRow[] = await dataSource.query(
      `SELECT "id", "prompt", "label", "weight", "gateMode"
       FROM "${schemaName}"."_trackCheck"
       WHERE "partnerTrackId" = $1 AND "deletedAt" IS NULL
       ORDER BY "position" ASC`,
      [discoveryRun.partnerTrackId],
    );

    // Create check evaluation records from Exa criteria evaluations
    for (let i = 0; i < item.criteriaEvaluations.length; i++) {
      const exaEvaluation = item.criteriaEvaluations[i];
      const matchingCheck = checkRows[i];

      if (!matchingCheck) {
        continue;
      }

      const evaluationId = crypto.randomUUID();

      // Map Exa status to our status format
      const status = this.mapExaStatusToCheckStatus(exaEvaluation.status);

      await dataSource.query(
        `INSERT INTO "${schemaName}"."_checkEvaluation" (
          "id", "status", "reasoningMd", "sources", "contribution",
          "partnerCandidateId", "trackCheckId",
          "createdAt", "updatedAt", "deletedAt", "position"
        ) VALUES ($1, $2, $3, $4, 0, $5, $6, $7, $7, NULL, 1.0)
        ON CONFLICT ("partnerCandidateId", "trackCheckId")
          WHERE "deletedAt" IS NULL
          DO UPDATE SET "status" = $2, "reasoningMd" = $3, "sources" = $4, "updatedAt" = $7`,
        [
          evaluationId,
          status,
          exaEvaluation.reasoning,
          JSON.stringify(exaEvaluation.sources),
          candidateId,
          matchingCheck.id,
          now,
        ],
      );
    }

    // Update result count on discovery run
    await dataSource.query(
      `UPDATE "${schemaName}"."_discoveryRun"
       SET "resultCount" = (
         SELECT COUNT(*) FROM "${schemaName}"."_partnerCandidate"
         WHERE "discoveryRunId" = $1 AND "deletedAt" IS NULL
       ), "updatedAt" = $2
       WHERE "id" = $1`,
      [discoveryRun.id, now],
    );

    this.logger.log(
      `Upserted candidate ${candidateId} for discovery run ${discoveryRun.id}`,
    );
  }

  // Workflow 3: Completion and scoring
  async handleSearchCompleted(
    event: ExaWebhookSearchCompletedEvent,
  ): Promise<void> {
    const websetId = event.data.search.websetId;
    const { discoveryRun, schemaName, dataSource } =
      await this.findDiscoveryRunByWebsetId(websetId);

    if (!discoveryRun) {
      this.logger.warn(
        `No discovery run found for webset ${websetId}, ignoring search.completed`,
      );

      return;
    }

    // Load track checks as ranking signals
    const checkRows: TrackCheckRow[] = await dataSource.query(
      `SELECT "id", "prompt", "label", "weight", "gateMode"
       FROM "${schemaName}"."_trackCheck"
       WHERE "partnerTrackId" = $1 AND "deletedAt" IS NULL`,
      [discoveryRun.partnerTrackId],
    );

    const signals: RankingSignal[] = checkRows.map((check) => ({
      id: check.id,
      label: check.label,
      prompt: check.prompt,
      weight: Number(check.weight) || 1,
      gateMode: (check.gateMode === 'must_pass' ? 'must_pass' : 'signal') as
        | 'must_pass'
        | 'signal',
    }));

    // Load all candidates for this run
    const candidates: PartnerCandidateRow[] = await dataSource.query(
      `SELECT "id", "discoveryRunId"
       FROM "${schemaName}"."_partnerCandidate"
       WHERE "discoveryRunId" = $1 AND "deletedAt" IS NULL`,
      [discoveryRun.id],
    );

    const now = new Date().toISOString();

    // Score each candidate
    for (const candidate of candidates) {
      const evalRows: CheckEvaluationRow[] = await dataSource.query(
        `SELECT "id", "trackCheckId", "status", "reasoningMd", "sources"
         FROM "${schemaName}"."_checkEvaluation"
         WHERE "partnerCandidateId" = $1 AND "deletedAt" IS NULL`,
        [candidate.id],
      );

      const evaluations: CheckEvaluation[] = evalRows.map((row) => ({
        checkId: row.trackCheckId,
        status: this.mapStoredStatusToCheckStatus(row.status),
        reasoningMd: row.reasoningMd,
        sources: row.sources ? JSON.parse(row.sources) : [],
      }));

      const score = this.scoringService.scoreCandidate({
        evaluations,
        signals,
        isExcluded: false,
      });

      // Update candidate with scores
      await dataSource.query(
        `UPDATE "${schemaName}"."_partnerCandidate"
         SET "fitScore" = $1, "confidence" = $2,
             "gateStatus" = $3, "gateReason" = $4,
             "updatedAt" = $5
         WHERE "id" = $6`,
        [
          Math.round(score.fitScore),
          Math.round(score.confidence * 100),
          score.gateStatus.toUpperCase(),
          score.gateReason,
          now,
          candidate.id,
        ],
      );

      // Update contribution on each check evaluation
      for (const [checkId, contribution] of Object.entries(
        score.contributionByCheckId,
      )) {
        await dataSource.query(
          `UPDATE "${schemaName}"."_checkEvaluation"
           SET "contribution" = $1, "updatedAt" = $2
           WHERE "partnerCandidateId" = $3 AND "trackCheckId" = $4
             AND "deletedAt" IS NULL`,
          [contribution, now, candidate.id, checkId],
        );
      }
    }

    // Mark discovery run as complete
    await dataSource.query(
      `UPDATE "${schemaName}"."_discoveryRun"
       SET "status" = $1, "completedAt" = $2, "updatedAt" = $2
       WHERE "id" = $3`,
      ['COMPLETE', now, discoveryRun.id],
    );

    this.logger.log(
      `Scored ${candidates.length} candidates for discovery run ${discoveryRun.id}`,
    );
  }

  // Workflow 4: Reconciliation
  async handleIdle(event: ExaWebhookIdleEvent): Promise<void> {
    const websetId = event.data.websetId;
    const exaItemCount = event.data.itemCount;

    const { discoveryRun, schemaName, dataSource } =
      await this.findDiscoveryRunByWebsetId(websetId);

    if (!discoveryRun) {
      this.logger.warn(
        `No discovery run found for webset ${websetId}, ignoring idle event`,
      );

      return;
    }

    // Count local candidates
    const countResult = await dataSource.query(
      `SELECT COUNT(*)::int AS count
       FROM "${schemaName}"."_partnerCandidate"
       WHERE "discoveryRunId" = $1 AND "deletedAt" IS NULL`,
      [discoveryRun.id],
    );

    const localCount: number = countResult[0]?.count ?? 0;

    if (localCount < exaItemCount) {
      this.logger.warn(
        `Reconciliation mismatch for discovery run ${discoveryRun.id}: ` +
          `Exa reports ${exaItemCount} items, local has ${localCount}. ` +
          `Fetching missing items...`,
      );

      // Fetch all items from Exa for reconciliation
      const exaItems = await this.exaClientService.getAllWebsetItems(websetId);

      // Re-process each item (upsert handles duplicates)
      for (const item of exaItems) {
        await this.handleItemCreated({
          type: 'webset.item.created',
          data: { item },
        });
      }

      this.logger.log(
        `Reconciliation complete for discovery run ${discoveryRun.id}: ` +
          `processed ${exaItems.length} items from Exa`,
      );
    } else {
      this.logger.log(
        `Reconciliation OK for discovery run ${discoveryRun.id}: ` +
          `${localCount} local items match ${exaItemCount} Exa items`,
      );
    }

    // Update progress metadata on the discovery run
    const now = new Date().toISOString();

    await dataSource.query(
      `UPDATE "${schemaName}"."_discoveryRun"
       SET "progress" = $1, "updatedAt" = $2
       WHERE "id" = $3`,
      [
        JSON.stringify({
          exaItemCount,
          localItemCount: localCount,
          reconciledAt: now,
        }),
        now,
        discoveryRun.id,
      ],
    );
  }

  // Helpers

  private async findDiscoveryRunByWebsetId(websetId: string): Promise<{
    discoveryRun: DiscoveryRunRow | null;
    schemaName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataSource: any;
  }> {
    const dataSource =
      await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource();

    // Search across all workspace schemas for the discovery run
    // In practice, we would store the workspaceId on the webset metadata
    // or use a lookup table. For now, query the core workspace list.
    const workspaces = await dataSource.query(
      `SELECT "id" FROM "core"."workspace"
       WHERE "activationStatus" = 'ACTIVE' AND "deletedAt" IS NULL`,
    );

    for (const workspace of workspaces) {
      const schemaName = getWorkspaceSchemaName(workspace.id);

      try {
        const rows: DiscoveryRunRow[] = await dataSource.query(
          `SELECT "id", "exaWebsetId", "partnerTrackId", "status"
           FROM "${schemaName}"."_discoveryRun"
           WHERE "exaWebsetId" = $1 AND "deletedAt" IS NULL
           LIMIT 1`,
          [websetId],
        );

        if (rows.length > 0) {
          return { discoveryRun: rows[0], schemaName, dataSource };
        }
      } catch {
        // Schema may not exist yet for some workspaces
        continue;
      }
    }

    return { discoveryRun: null, schemaName: '', dataSource };
  }

  private mapExaStatusToCheckStatus(
    exaStatus: string,
  ): 'MATCH' | 'NO_MATCH' | 'UNCLEAR' {
    switch (exaStatus) {
      case 'Match':
        return 'MATCH';
      case 'No Match':
        return 'NO_MATCH';
      default:
        return 'UNCLEAR';
    }
  }

  private mapStoredStatusToCheckStatus(
    storedStatus: string,
  ): 'Match' | 'No Match' | 'Unclear' {
    switch (storedStatus) {
      case 'MATCH':
        return 'Match';
      case 'NO_MATCH':
        return 'No Match';
      default:
        return 'Unclear';
    }
  }
}
