import { DynamicModule, Module, Provider } from '@nestjs/common';

import { EmailService } from './email.service';
import { EmailModuleAsyncOptions } from './types';

@Module({})
export class EmailModule {
  public static registerAsync(options: EmailModuleAsyncOptions): DynamicModule {
    const provider: Provider = {
      inject: options.inject,
      provide: EmailService,
      useFactory(...args: unknown[]) {
        return new EmailService(options.useFactory(...args));
      },
    };

    return {
      module: EmailModule,
      providers: [provider],
      exports: [provider],
    };
  }
}
