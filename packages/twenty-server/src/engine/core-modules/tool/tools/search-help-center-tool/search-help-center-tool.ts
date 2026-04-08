import { Injectable } from '@nestjs/common';

import { isAxiosError } from 'axios';

import { SecureHttpClientService } from 'src/engine/core-modules/secure-http-client/secure-http-client.service';
import { SearchHelpCenterInputZodSchema } from 'src/engine/core-modules/tool/tools/search-help-center-tool/search-help-center-tool.schema';
import { type ToolInput } from 'src/engine/core-modules/tool/types/tool-input.type';
import { type ToolOutput } from 'src/engine/core-modules/tool/types/tool-output.type';
import {
  type Tool,
  type ToolExecutionContext,
} from 'src/engine/core-modules/tool/types/tool.type';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

@Injectable()
export class SearchHelpCenterTool implements Tool {
  description =
    'Search Twenty documentation and help center to find information about features, setup, usage, and troubleshooting.';
  inputSchema = SearchHelpCenterInputZodSchema;

  constructor(
    private readonly twentyConfigService: TwentyConfigService,
    private readonly secureHttpClientService: SecureHttpClientService,
  ) {}

  async execute(
    parameters: ToolInput,
    _context: ToolExecutionContext,
  ): Promise<ToolOutput> {
    const { query } = parameters;
    const helpCenterSearchEnabled = this.twentyConfigService.get(
      'HELP_CENTER_SEARCH_ENABLED',
    );
    const helpCenterSearchProvider = String(
      this.twentyConfigService.get('HELP_CENTER_SEARCH_PROVIDER'),
    ).toLowerCase();

    if (!helpCenterSearchEnabled || helpCenterSearchProvider === 'none') {
      return {
        success: false,
        message: 'Help center search is disabled by server configuration',
        error: 'HELP_CENTER_SEARCH_DISABLED',
      };
    }

    try {
      const MINTLIFY_API_KEY = this.twentyConfigService.get('MINTLIFY_API_KEY');
      const MINTLIFY_SUBDOMAIN =
        this.twentyConfigService.get('MINTLIFY_SUBDOMAIN');

      const useDirectApi =
        helpCenterSearchProvider === 'mintlify' &&
        MINTLIFY_API_KEY &&
        MINTLIFY_SUBDOMAIN;

      if (
        helpCenterSearchProvider === 'mintlify' &&
        (!MINTLIFY_API_KEY || !MINTLIFY_SUBDOMAIN)
      ) {
        return {
          success: false,
          message:
            'Help center search provider is mintlify but required configuration is missing',
          error: 'MINTLIFY_CONFIG_MISSING',
        };
      }

      const endpoint = useDirectApi
        ? `https://api-dsc.mintlify.com/v1/search/${MINTLIFY_SUBDOMAIN}`
        : 'https://twenty-help-search.com/search/twenty';

      const headers = {
        'Content-Type': 'application/json',
        ...(useDirectApi && { Authorization: `Bearer ${MINTLIFY_API_KEY}` }),
      };

      const httpClient = this.secureHttpClientService.getHttpClient();

      const response = await httpClient.post(
        endpoint,
        { query, pageSize: 10 },
        { headers },
      );

      const results = response.data;

      if (results.length === 0) {
        return {
          success: true,
          message: `No help center articles found for "${query}"`,
          result: [],
        };
      }

      return {
        success: true,
        message: `Found ${results.length} relevant help center article${results.length === 1 ? '' : 's'} for "${query}"`,
        result: results,
      };
    } catch (error) {
      const errorDetail = isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : 'Help center search failed';

      return {
        success: false,
        message: `Failed to search help center for "${query}"`,
        error: errorDetail,
      };
    }
  }
}
