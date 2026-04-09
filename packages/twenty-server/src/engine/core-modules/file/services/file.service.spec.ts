import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { FileFolder } from 'twenty-shared/types';

import { ApplicationEntity } from 'src/engine/core-modules/application/application.entity';
import { FileStorageService } from 'src/engine/core-modules/file-storage/file-storage.service';
import {
  FileStorageException,
  FileStorageExceptionCode,
} from 'src/engine/core-modules/file-storage/interfaces/file-storage-exception';
import { FileEntity } from 'src/engine/core-modules/file/entities/file.entity';
import { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

import { FileService } from './file.service';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('FileService', () => {
  let service: FileService;
  let fileRepository: { findOne: jest.Mock };
  let applicationRepository: { findOne: jest.Mock };

  beforeEach(async () => {
    fileRepository = {
      findOne: jest.fn(),
    };
    applicationRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: TwentyConfigService,
          useValue: {},
        },
        {
          provide: JwtWrapperService,
          useValue: {},
        },
        {
          provide: FileStorageService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(FileEntity),
          useValue: fileRepository,
        },
        {
          provide: getRepositoryToken(ApplicationEntity),
          useValue: applicationRepository,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should translate missing public asset metadata into FILE_NOT_FOUND', async () => {
    fileRepository.findOne.mockResolvedValue(null);

    await expect(
      service.getFileStreamByPath({
        workspaceId: 'workspace-id',
        applicationId: 'app-id',
        filepath: 'images/logo.png',
        fileFolder: FileFolder.PublicAsset,
      }),
    ).rejects.toEqual(
      new FileStorageException(
        'File metadata not found',
        FileStorageExceptionCode.FILE_NOT_FOUND,
      ),
    );

    expect(fileRepository.findOne).toHaveBeenCalledWith({
      where: {
        path: `${FileFolder.PublicAsset}/images/logo.png`,
        workspaceId: 'workspace-id',
        applicationId: 'app-id',
      },
    });
  });

  it('should translate missing file id metadata into FILE_NOT_FOUND', async () => {
    fileRepository.findOne.mockResolvedValue(null);

    await expect(
      service.getFileStreamById({
        fileId: 'file-id',
        workspaceId: 'workspace-id',
        fileFolder: FileFolder.Workflow,
      }),
    ).rejects.toEqual(
      new FileStorageException(
        'File metadata not found',
        FileStorageExceptionCode.FILE_NOT_FOUND,
      ),
    );

    expect(fileRepository.findOne).toHaveBeenCalledTimes(1);

    const [{ where }] = fileRepository.findOne.mock.calls[0];

    expect(where.id).toBe('file-id');
    expect(where.workspaceId).toBe('workspace-id');
    expect(where.path).toBeDefined();
  });

  it('should translate missing file response metadata into FILE_NOT_FOUND', async () => {
    fileRepository.findOne.mockResolvedValue(null);

    await expect(
      service.getFileResponseById({
        fileId: 'file-id',
        workspaceId: 'workspace-id',
        fileFolder: FileFolder.Workflow,
      }),
    ).rejects.toEqual(
      new FileStorageException(
        'File metadata not found',
        FileStorageExceptionCode.FILE_NOT_FOUND,
      ),
    );
  });
});
