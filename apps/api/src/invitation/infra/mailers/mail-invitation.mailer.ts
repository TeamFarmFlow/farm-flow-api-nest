import { Injectable } from '@nestjs/common';

import { EmailService } from '@libs/email';

import { InvitationMailerPort } from '../../application';

@Injectable()
export class MailInvitationMailer implements InvitationMailerPort {
  constructor(private readonly emailService: EmailService) {}

  async sendInvitation(email: string, code: string, url: string, farmName: string): Promise<void> {
    await this.emailService.sendInvitationMail(email, code, url, farmName);
  }
}
