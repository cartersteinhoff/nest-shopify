import { Module } from '@nestjs/common';
import { MyAuthHandler } from './my-auth.handler';

@Module({
  providers: [MyAuthHandler],
  exports: [MyAuthHandler],
})
export class AuthHandlerModule {}
