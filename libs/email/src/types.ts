import { InjectionToken, OptionalFactoryDependency } from '@nestjs/common';

import SMTPTransport from 'nodemailer/lib/smtp-transport';

export type EmailModuleOptions = SMTPTransport.Options;
export type EmailModuleAsyncOptions = {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory(...args: unknown[]): EmailModuleOptions;
};

export type EmailSendResult = {
  messageId: string;
  accepted: string[];
  rejected: string[];
  ehlo: string[];
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: {
    from: string;
    to: string[];
  };
};
