import { Module } from '@nestjs/common';

import { DataSourceModule } from 'src/engine/metadata-modules/data-source/data-source.module';
import { PartnerOsSeedCommand } from 'src/modules/partner-os/commands/partner-os-seed.command';
import { PartnerOsModule } from 'src/modules/partner-os/partner-os.module';

@Module({
  imports: [PartnerOsModule, DataSourceModule],
  providers: [PartnerOsSeedCommand],
})
export class PartnerOsSeedModule {}
