import { Injectable } from '@nestjs/common';

import type { FileFolder } from 'twenty-shared/types';

import {
  type FileTokenJwtPayload,
  JwtTokenTypeEnum,
} from 'src/engine/core-modules/auth/types/auth-context.type';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { fileFolderConfigs } from 'src/engine/core-modules/file/interfaces/file-folder.interface';

@Injectable()
export class FileUrlService {
  constructor(
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  signFileByIdUrl({
    fileId,
    workspaceId,
    fileFolder,
  }: {
    fileId: string;
    workspaceId: string;
    fileFolder: FileFolder;
  }): string {
    const { ignoreExpirationToken } = fileFolderConfigs[fileFolder];
    const fileTokenExpiresIn = this.twentyConfigService.get(
      'FILE_TOKEN_EXPIRES_IN',
    );

    const payload: FileTokenJwtPayload = {
      workspaceId,
      fileId,
      sub: workspaceId,
      type: JwtTokenTypeEnum.FILE,
    };

    const secret = this.jwtWrapperService.generateAppSecret(
      payload.type,
      workspaceId,
    );

    const token = this.jwtWrapperService.sign(
      payload,
      ignoreExpirationToken
        ? {
            secret,
            // Keep URL signatures stable for cacheable folders.
            noTimestamp: true,
          }
        : {
            secret,
            expiresIn: fileTokenExpiresIn,
          },
    );

    const serverUrl = this.twentyConfigService.get('SERVER_URL');

    return `${serverUrl}/file/${fileFolder}/${fileId}?token=${token}`;
  }
}
