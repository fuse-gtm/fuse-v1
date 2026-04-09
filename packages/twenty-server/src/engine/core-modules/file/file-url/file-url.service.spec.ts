import { FileFolder } from 'twenty-shared/types';

import { JwtTokenTypeEnum } from 'src/engine/core-modules/auth/types/auth-context.type';
import type { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';
import type { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

import { FileUrlService } from './file-url.service';

describe('FileUrlService', () => {
  const sign = jest.fn().mockReturnValue('signed-token');
  const generateAppSecret = jest.fn().mockReturnValue('workspace-secret');
  const get = jest.fn((key: string) => {
    if (key === 'FILE_TOKEN_EXPIRES_IN') {
      return '1d';
    }

    if (key === 'SERVER_URL') {
      return 'https://server.example.com';
    }

    return undefined;
  });

  const jwtWrapperService = {
    sign,
    generateAppSecret,
  } as unknown as JwtWrapperService;

  const twentyConfigService = {
    get,
  } as unknown as TwentyConfigService;

  const service = new FileUrlService(jwtWrapperService, twentyConfigService);

  beforeEach(() => {
    jest.clearAllMocks();
    sign.mockReturnValue('signed-token');
    generateAppSecret.mockReturnValue('workspace-secret');
  });

  it('signs cacheable core picture URLs without timestamp-based expiration', () => {
    const url = service.signFileByIdUrl({
      fileId: 'file-id',
      workspaceId: 'workspace-id',
      fileFolder: FileFolder.CorePicture,
    });

    expect(generateAppSecret).toHaveBeenCalledWith(
      JwtTokenTypeEnum.FILE,
      'workspace-id',
    );
    expect(sign).toHaveBeenCalledWith(
      expect.objectContaining({
        fileId: 'file-id',
        workspaceId: 'workspace-id',
        sub: 'workspace-id',
        type: JwtTokenTypeEnum.FILE,
      }),
      {
        secret: 'workspace-secret',
        noTimestamp: true,
      },
    );
    expect(url).toBe(
      'https://server.example.com/file/core-picture/file-id?token=signed-token',
    );
  });

  it('signs non-cacheable file URLs with expiration', () => {
    service.signFileByIdUrl({
      fileId: 'file-id',
      workspaceId: 'workspace-id',
      fileFolder: FileFolder.FilesField,
    });

    expect(sign).toHaveBeenCalledWith(
      expect.objectContaining({
        fileId: 'file-id',
      }),
      {
        secret: 'workspace-secret',
        expiresIn: '1d',
      },
    );
  });
});
