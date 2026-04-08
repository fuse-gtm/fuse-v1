import { Injectable, Logger } from '@nestjs/common';

import {
  type ExaCreateWebsetRequest,
  type ExaCreateWebsetResponse,
  type ExaListWebsetItemsResponse,
  type ExaWebsetItem,
} from 'src/modules/partner-os/types/exa-webhook.types';

const EXA_API_BASE_URL = 'https://api.exa.ai/v0';

@Injectable()
export class ExaClientService {
  private readonly logger = new Logger(ExaClientService.name);

  private getApiKey(): string {
    const apiKey = process.env.EXA_API_KEY;

    if (!apiKey) {
      throw new Error('EXA_API_KEY environment variable is not set');
    }

    return apiKey;
  }

  async createWebset(
    payload: ExaCreateWebsetRequest,
  ): Promise<ExaCreateWebsetResponse> {
    const response = await fetch(`${EXA_API_BASE_URL}/websets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.getApiKey(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();

      this.logger.error(
        `Exa createWebset failed: ${response.status} ${errorBody}`,
      );
      throw new Error(
        `Exa API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json() as Promise<ExaCreateWebsetResponse>;
  }

  async getWebsetItems(
    websetId: string,
    cursor?: string,
  ): Promise<ExaListWebsetItemsResponse> {
    const url = new URL(`${EXA_API_BASE_URL}/websets/${websetId}/items`);

    if (cursor) {
      url.searchParams.set('cursor', cursor);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': this.getApiKey(),
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();

      this.logger.error(
        `Exa getWebsetItems failed: ${response.status} ${errorBody}`,
      );
      throw new Error(
        `Exa API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json() as Promise<ExaListWebsetItemsResponse>;
  }

  async getAllWebsetItems(websetId: string): Promise<ExaWebsetItem[]> {
    const allItems: ExaWebsetItem[] = [];
    let cursor: string | undefined;

    do {
      const page = await this.getWebsetItems(websetId, cursor);

      allItems.push(...page.data);
      cursor = page.hasMore ? page.nextCursor : undefined;
    } while (cursor);

    return allItems;
  }
}
