import { Injectable } from '@nestjs/common';

import { MailService } from '@app/infra/mail';

import { InvitationMailerPort } from '../../application';

@Injectable()
export class MailInvitationMailer implements InvitationMailerPort {
  constructor(private readonly mailService: MailService) {}

  async sendInvitation(email: string, code: string, url: string, farmName: string): Promise<void> {
    await this.mailService.sendInvitationMail(email, code, url, farmName);
  }
}
