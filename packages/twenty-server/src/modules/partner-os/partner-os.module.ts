import { Module } from '@nestjs/common';

import { DataSourceModule } from 'src/engine/metadata-modules/data-source/data-source.module';
import { FieldMetadataModule } from 'src/engine/metadata-modules/field-metadata/field-metadata.module';
import { WorkspaceManyOrAllFlatEntityMapsCacheModule } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { ViewModule } from 'src/engine/metadata-modules/view/view.module';
import { PartnerDiscoveryAdapterService } from 'src/modules/partner-os/services/partner-discovery-adapter.service';
import { PartnerOsMetadataBootstrapService } from 'src/modules/partner-os/services/partner-os-metadata-bootstrap.service';
import { PartnerScoringService } from 'src/modules/partner-os/services/partner-scoring.service';

@Module({
  imports: [
    DataSourceModule,
    ObjectMetadataModule,
    FieldMetadataModule,
    ViewModule,
    WorkspaceManyOrAllFlatEntityMapsCacheModule,
  ],
  providers: [
    PartnerOsMetadataBootstrapService,
    PartnerScoringService,
    PartnerDiscoveryAdapterService,
  ],
  exports: [
    PartnerOsMetadataBootstrapService,
    PartnerScoringService,
    PartnerDiscoveryAdapterService,
  ],
})
export class PartnerOsModule {}
