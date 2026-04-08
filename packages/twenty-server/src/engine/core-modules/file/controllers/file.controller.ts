import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { join } from 'path';

import type { Request, Response } from 'express';
import { FileFolder } from 'twenty-shared/types';

import {
  FileStorageException,
  FileStorageExceptionCode,
} from 'src/engine/core-modules/file-storage/interfaces/file-storage-exception';

import {
  FileException,
  FileExceptionCode,
} from 'src/engine/core-modules/file/file.exception';
import { FileApiExceptionFilter } from 'src/engine/core-modules/file/filters/file-api-exception.filter';
import { FilePathGuard } from 'src/engine/core-modules/file/guards/file-path-guard';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FileService } from 'src/engine/core-modules/file/services/file.service';
import { extractFileInfoFromRequest } from 'src/engine/core-modules/file/utils/extract-file-info-from-request.utils';
import { setFileResponseHeaders } from 'src/engine/core-modules/file/utils/set-file-response-headers.utils';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import {
  FileByIdGuard,
  type SupportedFileFolder,
} from 'src/engine/core-modules/file/guards/file-by-id.guard';
import { fileFolderConfigs } from 'src/engine/core-modules/file/interfaces/file-folder.interface';

@Controller()
@UseFilters(FileApiExceptionFilter)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  private setCacheControlHeader({
    res,
    ignoreExpirationToken,
  }: {
    res: Response;
    ignoreExpirationToken: boolean;
  }) {
    res.setHeader(
      'Cache-Control',
      ignoreExpirationToken
        ? 'public, max-age=31536000, immutable'
        : 'private, max-age=0, must-revalidate',
    );
  }

  @Get('public-assets/:workspaceId/:applicationId/*path')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getPublicAssets(
    @Res() res: Response,
    @Req() req: Request,
    @Param('workspaceId') workspaceId: string,
    @Param('applicationId')
    applicationId: string,
  ) {
    const filepath = join(...req.params.path);

    try {
      const { stream, mimeType } = await this.fileService.getFileStreamByPath({
        workspaceId,
        applicationId,
        fileFolder: FileFolder.PublicAsset,
        filepath,
      });

      setFileResponseHeaders(res, mimeType);
      res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');

      stream.on('error', () => {
        throw new FileException(
          'Error streaming file from storage',
          FileExceptionCode.INTERNAL_SERVER_ERROR,
        );
      });

      stream.pipe(res);
    } catch (error) {
      if (
        error instanceof FileStorageException &&
        error.code === FileStorageExceptionCode.FILE_NOT_FOUND
      ) {
        throw new FileException(
          'File not found',
          FileExceptionCode.FILE_NOT_FOUND,
        );
      }

      throw new FileException(
        `Error retrieving file: ${error.message}`,
        FileExceptionCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('files/*path')
  @UseGuards(FilePathGuard, NoPermissionGuard)
  async getFile(@Res() res: Response, @Req() req: Request) {
    const workspaceId = (req as Request & { workspaceId?: string })?.workspaceId;

    const { rawFolder, filename, ignoreExpirationToken } =
      extractFileInfoFromRequest(req);

    try {
      const fileStream = await this.fileService.getFileStream(
        rawFolder,
        filename,
        workspaceId!,
      );

      this.setCacheControlHeader({
        res,
        ignoreExpirationToken,
      });

      fileStream.on('error', () => {
        throw new FileException(
          'Error streaming file from storage',
          FileExceptionCode.INTERNAL_SERVER_ERROR,
        );
      });

      fileStream.pipe(res);
    } catch (error) {
      if (
        error instanceof FileStorageException &&
        error.code === FileStorageExceptionCode.FILE_NOT_FOUND
      ) {
        throw new FileException(
          'File not found',
          FileExceptionCode.FILE_NOT_FOUND,
        );
      }

      throw new FileException(
        `Error retrieving file: ${error.message}`,
        FileExceptionCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('file/:fileFolder/:id')
  @UseGuards(FileByIdGuard, NoPermissionGuard)
  async getFileById(
    @Res() res: Response,
    @Req() req: Request,
    @Param('fileFolder') fileFolder: SupportedFileFolder,
    @Param('id') fileId: string,
  ) {
    const workspaceId = (req as Request & { workspaceId?: string })?.workspaceId;

    try {
      const { stream, mimeType } = await this.fileService.getFileStreamById({
        fileId,
        workspaceId: workspaceId!,
        fileFolder,
      });

      setFileResponseHeaders(res, mimeType);
      this.setCacheControlHeader({
        res,
        ignoreExpirationToken: fileFolderConfigs[fileFolder]
          .ignoreExpirationToken,
      });

      stream.on('error', () => {
        throw new FileException(
          'Error streaming file from storage',
          FileExceptionCode.INTERNAL_SERVER_ERROR,
        );
      });

      stream.pipe(res);
    } catch (error) {
      if (
        error instanceof FileStorageException &&
        error.code === FileStorageExceptionCode.FILE_NOT_FOUND
      ) {
        throw new FileException(
          'File not found',
          FileExceptionCode.FILE_NOT_FOUND,
        );
      }

      throw new FileException(
        `Error retrieving file: ${error.message}`,
        FileExceptionCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
