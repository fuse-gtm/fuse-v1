import { Injectable } from '@nestjs/common';

// TODO: upstream cherry-pick stub - module not yet in fork
@Injectable()
export class ApplicationRegistrationService {
  async findOneByClientId(clientId: string): Promise<any> {
    return null;
  }
}
