import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';

import '@shopify/shopify-api/adapters/node';
import { ApiVersion } from '@shopify/shopify-api';

import { ShopifyCoreModule } from '@nestjs-shopify/core';
import { ShopifyAuthModule } from '@nestjs-shopify/auth';
import { ShopifyWebhooksModule } from '@nestjs-shopify/webhooks';

import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import { PrismaClient } from '@prisma/client';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthHandlerModule } from './auth-handler/auth-handler.module';
import { MyAuthHandler } from './auth-handler/my-auth.handler';

import { CustomersCreateWebhookHandler } from './webhooks/customers-create.webhook-handler';

const prisma = new PrismaClient();
const storage = new PrismaSessionStorage(prisma);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ShopifyCoreModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          apiKey: configService.get('SHOPIFY_API_KEY'),
          apiSecretKey: configService.get('SHOPIFY_API_SECRET'),
          apiVersion: ApiVersion.July23,
          hostName: configService.get('HOST').replace(/https:\/\//, ''),
          isEmbeddedApp: false,
          sessionStorage: storage,
          scopes: [
            'read_products',
            'write_products',
            'read_customers',
            'write_customers',
            'read_orders',
          ],
          debug: true,
        };
      },
      inject: [ConfigService],
    }),
    ShopifyWebhooksModule.forRootAsync({
      useFactory: () => ({
        path: '/shopify-webhooks',
      }),
    }),
    ShopifyAuthModule.forRootAsyncOffline({
      imports: [AuthHandlerModule],
      useFactory: (afterAuthHandler: MyAuthHandler) => ({
        basePath: 'user',
        returnHeaders: true,
        afterAuthHandler,
      }),
      inject: [MyAuthHandler],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, CustomersCreateWebhookHandler],
})
export class AppModule {}
