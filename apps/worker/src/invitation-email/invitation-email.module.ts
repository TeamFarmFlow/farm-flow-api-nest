import { DynamicModule, Module, Provider } from '@nestjs/common';

import { INVITATION_EMAIL_SENDER } from './application';
import { SendInvitationEmailJobHandler } from './application';
import { EMAIL_TRANSPORT_OPTIONS, EmailModuleAsyncOptions, NodemailerInvitationEmailSender } from './infra';
import { InvitationEmailProcessor } from './invitation-email.processor';

@Module({})
export class InvitationEmailModule {
  static registerAsync(options: EmailModuleAsyncOptions): DynamicModule {
    const transportOptionsProvider: Provider = {
      inject: options.inject,
      provide: EMAIL_TRANSPORT_OPTIONS,
      useFactory(...args: unknown[]) {
        return options.useFactory(...args);
      },
    };

    return {
      module: InvitationEmailModule,
      providers: [
        transportOptionsProvider,
        {
          provide: INVITATION_EMAIL_SENDER,
          useExisting: NodemailerInvitationEmailSender,
        },
        InvitationEmailProcessor,
        SendInvitationEmailJobHandler,
        NodemailerInvitationEmailSender,
      ],
      exports: [transportOptionsProvider],
    };
  }
}
