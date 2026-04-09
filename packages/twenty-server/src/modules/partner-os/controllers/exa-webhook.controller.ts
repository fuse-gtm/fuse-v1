import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  RawBody,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { createHmac, timingSafeEqual } from 'crypto';

import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { PartnerDiscoveryOrchestratorService } from 'src/modules/partner-os/services/partner-discovery-orchestrator.service';
import { type ExaWebhookEvent } from 'src/modules/partner-os/types/exa-webhook.types';

@Controller('partner-os')
export class ExaWebhookController {
  private readonly logger = new Logger(ExaWebhookController.name);

  constructor(
    private readonly orchestratorService: PartnerDiscoveryOrchestratorService,
  ) {}

  @Post('exa-webhook')
  @UseGuards(PublicEndpointGuard)
  @HttpCode(200)
  async handleExaWebhook(
    @Body() body: ExaWebhookEvent,
    @RawBody() rawBody: Buffer,
    @Headers('x-webhook-signature') signature?: string,
  ): Promise<{ received: true }> {
    this.verifySignature(rawBody, signature);

    this.logger.log(`Received Exa webhook event: ${body.type}`);

    // Process asynchronously to return 200 quickly
    this.processEvent(body).catch((error) => {
      this.logger.error(
        `Failed to process Exa webhook event ${body.type}: ${error.message}`,
        error.stack,
      );
    });

    return { received: true };
  }

  private verifySignature(
    rawBody: Buffer,
    signature: string | undefined,
  ): void {
    const webhookSecret = process.env.EXA_WEBHOOK_SECRET;

    if (!webhookSecret) {
      this.logger.warn(
        'EXA_WEBHOOK_SECRET not configured, skipping signature verification',
      );

      return;
    }

    if (!signature) {
      throw new UnauthorizedException('Missing webhook signature');
    }

    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const isValid = timingSafeEqual(
      Buffer.from(signature, 'utf-8'),
      Buffer.from(expectedSignature, 'utf-8'),
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }

  private async processEvent(event: ExaWebhookEvent): Promise<void> {
    switch (event.type) {
      case 'webset.item.created':
        await this.orchestratorService.handleItemCreated(event);
        break;

      case 'webset.item.enriched':
        // Enriched items are handled the same as created for now
        await this.orchestratorService.handleItemCreated(event);
        break;

      case 'webset.search.completed':
        await this.orchestratorService.handleSearchCompleted(event);
        break;

      case 'webset.idle':
        await this.orchestratorService.handleIdle(event);
        break;

      default:
        this.logger.warn(
          `Unknown Exa webhook event type: ${(event as ExaWebhookEvent).type}`,
        );
    }
  }
}
