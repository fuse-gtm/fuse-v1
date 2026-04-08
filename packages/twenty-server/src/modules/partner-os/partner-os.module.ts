import { Module } from '@nestjs/common';

import { DataSourceModule } from 'src/engine/metadata-modules/data-source/data-source.module';
import { FieldMetadataModule } from 'src/engine/metadata-modules/field-metadata/field-metadata.module';
import { WorkspaceManyOrAllFlatEntityMapsCacheModule } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { ViewFilterModule } from 'src/engine/metadata-modules/view-filter/view-filter.module';
import { ViewSortModule } from 'src/engine/metadata-modules/view-sort/view-sort.module';
import { ViewModule } from 'src/engine/metadata-modules/view/view.module';
import { ExaWebhookController } from 'src/modules/partner-os/controllers/exa-webhook.controller';
import { StaleHandoffReminderCronJob } from 'src/modules/partner-os/crons/jobs/stale-handoff-reminder.cron.job';
import { PartnerCustomerMapHandoffListener } from 'src/modules/partner-os/listeners/partner-customer-map-handoff.listener';
import { ExaClientService } from 'src/modules/partner-os/services/exa-client.service';
import { PartnerDiscoveryAdapterService } from 'src/modules/partner-os/services/partner-discovery-adapter.service';
import { PartnerDiscoveryOrchestratorService } from 'src/modules/partner-os/services/partner-discovery-orchestrator.service';
import { PartnerOsMetadataBootstrapService } from 'src/modules/partner-os/services/partner-os-metadata-bootstrap.service';
import { PartnerScoringService } from 'src/modules/partner-os/services/partner-scoring.service';

@Module({
  imports: [
    DataSourceModule,
    ObjectMetadataModule,
    FieldMetadataModule,
    ViewModule,
    ViewFilterModule,
    ViewSortModule,
    WorkspaceManyOrAllFlatEntityMapsCacheModule,
  ],
  controllers: [ExaWebhookController],
  providers: [
    PartnerOsMetadataBootstrapService,
    PartnerScoringService,
    PartnerDiscoveryAdapterService,
    PartnerDiscoveryOrchestratorService,
    ExaClientService,
    PartnerCustomerMapHandoffListener,
    StaleHandoffReminderCronJob,
  ],
  exports: [
    PartnerOsMetadataBootstrapService,
    PartnerScoringService,
    PartnerDiscoveryAdapterService,
    PartnerDiscoveryOrchestratorService,
    ExaClientService,
  ],
})
export class PartnerOsModule {}
