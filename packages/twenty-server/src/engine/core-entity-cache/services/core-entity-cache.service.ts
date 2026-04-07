import { Injectable } from '@nestjs/common';

// TODO: upstream cherry-pick stub - module not yet in fork
@Injectable()
export class CoreEntityCacheService {
  async invalidate(entityName: string, id: string): Promise<void> {}
}
