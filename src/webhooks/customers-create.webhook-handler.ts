import {
  ShopifyWebhookHandler,
  WebhookHandler,
} from '@nestjs-shopify/webhooks';

@WebhookHandler('customers/create')
export class CustomersCreateWebhookHandler extends ShopifyWebhookHandler {
  async handle(shop: string, customer: unknown): Promise<void> {
    console.log(shop, customer);
  }
}
