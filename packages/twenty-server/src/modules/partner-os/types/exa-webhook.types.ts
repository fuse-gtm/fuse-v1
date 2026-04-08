// Exa Webset API types

export type ExaWebsetStatus =
  | 'running'
  | 'idle'
  | 'paused'
  | 'canceled'
  | 'completed';

export type ExaWebsetItemStatus = 'created' | 'enriched';

export type ExaWebsetCriterionEvaluation = {
  description: string;
  status: 'Match' | 'No Match' | 'Unclear';
  reasoning: string;
  sources: string[];
};

export type ExaWebsetEnrichmentEvaluation = {
  description: string;
  value: string;
  reasoning: string;
  sources: string[];
};

export type ExaWebsetItem = {
  id: string;
  websetId: string;
  url: string;
  title: string;
  description: string;
  criteriaEvaluations: ExaWebsetCriterionEvaluation[];
  enrichmentEvaluations: ExaWebsetEnrichmentEvaluation[];
  status: ExaWebsetItemStatus;
  createdAt: string;
  updatedAt: string;
};

export type ExaWebsetSearchMeta = {
  id: string;
  websetId: string;
  query: string;
  status: 'completed' | 'running';
  itemCount: number;
};

// Webhook event types

export type ExaWebhookEventType =
  | 'webset.item.created'
  | 'webset.item.enriched'
  | 'webset.search.completed'
  | 'webset.idle';

export type ExaWebhookItemEvent = {
  type: 'webset.item.created' | 'webset.item.enriched';
  data: {
    item: ExaWebsetItem;
  };
};

export type ExaWebhookSearchCompletedEvent = {
  type: 'webset.search.completed';
  data: {
    search: ExaWebsetSearchMeta;
  };
};

export type ExaWebhookIdleEvent = {
  type: 'webset.idle';
  data: {
    websetId: string;
    itemCount: number;
  };
};

export type ExaWebhookEvent =
  | ExaWebhookItemEvent
  | ExaWebhookSearchCompletedEvent
  | ExaWebhookIdleEvent;

// Exa API response types

export type ExaCreateWebsetRequest = {
  search: {
    query: string;
    entity?: {
      type: string;
    };
    criteria?: Array<{
      description: string;
    }>;
    count?: number;
  };
  enrichments?: Array<{
    description: string;
    format?: string;
  }>;
  webhookUrl?: string;
  webhookSecret?: string;
};

export type ExaCreateWebsetResponse = {
  id: string;
  status: ExaWebsetStatus;
  searches: ExaWebsetSearchMeta[];
  createdAt: string;
  updatedAt: string;
};

export type ExaListWebsetItemsResponse = {
  data: ExaWebsetItem[];
  hasMore: boolean;
  nextCursor?: string;
};
