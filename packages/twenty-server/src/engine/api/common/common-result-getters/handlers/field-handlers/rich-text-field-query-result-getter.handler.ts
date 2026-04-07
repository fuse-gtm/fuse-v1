import { type ObjectRecord } from 'twenty-shared/types';

import { type QueryResultGetterHandlerInterface } from 'src/engine/api/graphql/workspace-query-runner/factories/query-result-getters/interfaces/query-result-getter-handler.interface';

import { type FileUrlService } from 'src/engine/core-modules/file/file-url/file-url.service';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';

// TODO: upstream cherry-pick stub - module not yet in fork
export class RichTextFieldQueryResultGetterHandler
  implements QueryResultGetterHandlerInterface
{
  constructor(private readonly fileUrlService: FileUrlService) {}

  async handle(
    record: ObjectRecord,
    workspaceId: string,
    flatFieldMetadata: FlatFieldMetadata[],
  ): Promise<ObjectRecord> {
    return record;
  }
}
