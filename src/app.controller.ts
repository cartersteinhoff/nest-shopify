import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AccessMode,
  CurrentSession,
  UseShopifyAuth,
} from '@nestjs-shopify/auth';

import { Session } from '@shopify/shopify-api';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseShopifyAuth(AccessMode.Offline)
  getHello(@CurrentSession() session: Session): string {
    console.log(session);
    return this.appService.getHello();
  }
}
