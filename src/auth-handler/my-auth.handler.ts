import { Injectable } from '@nestjs/common';
import { ShopifyAuthAfterHandler } from '@nestjs-shopify/auth';
import { ShopifyWebhooksService } from '@nestjs-shopify/webhooks';
import { Session } from '@shopify/shopify-api';
import { IncomingMessage, ServerResponse } from 'http';

console.log('hello');

@Injectable()
export class MyAuthHandler implements ShopifyAuthAfterHandler {
  constructor(private readonly webhooksService: ShopifyWebhooksService) {}
  async afterAuth(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    session: Session,
  ) {
    if (session.isOnline) {
      console.log('Online access token');
      return;
    }
    // Otherwise, we have an offline access token
    console.log('offline');
    await this.webhooksService.registerWebhooks(session);
    // Your other logic for offline auth...
  }
}
