import { DynamicModule, Module, Provider } from '@nestjs/common';

import { MailService } from './mail.service';
import { MailModuleAsyncOptions } from './types';

@Module({})
export class MailModule {
  public static registerAsync(options: MailModuleAsyncOptions): DynamicModule {
    const provider: Provider = {
      inject: options.inject,
      provide: MailService,
      useFactory(...args: unknown[]) {
        return new MailService(options.useFactory(...args));
      },
    };

    return {
      module: MailModule,
      providers: [provider],
      exports: [provider],
    };
  }
}
