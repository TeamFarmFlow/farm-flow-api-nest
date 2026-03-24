import { InjectionToken, OptionalFactoryDependency } from '@nestjs/common';

import SMTPTransport from 'nodemailer/lib/smtp-transport';

export type EmailTransportOptions = SMTPTransport.Options;
export type EmailModuleAsyncOptions = {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory(...args: unknown[]): EmailTransportOptions;
};
