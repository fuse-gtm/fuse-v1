import { Injectable } from '@nestjs/common';

// TODO: upstream cherry-pick stub - module not yet in fork
@Injectable()
export class EnterprisePlanService {
  hasValidEnterpriseKey(): boolean {
    return false;
  }

  hasValidSignedEnterpriseKey(): boolean {
    return false;
  }

  hasValidEnterpriseValidityToken(): boolean {
    return false;
  }
}
