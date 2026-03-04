import { InjectionToken, OptionalFactoryDependency } from '@nestjs/common';

import SMTPTransport from 'nodemailer/lib/smtp-transport';

export type MailModuleOptions = SMTPTransport.Options;
export type MailModuleAsyncOptions = {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory(...args: unknown[]): MailModuleOptions;
};

export type MailSendResult = {
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
