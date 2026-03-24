import { Inject, Injectable } from '@nestjs/common';

import { INVITATION_EMAIL_SENDER, InvitationEmailSenderPort } from '../ports';

import { SendInvitationEmailJob } from './send-invitation-email.job';

@Injectable()
export class SendInvitationEmailJobHandler {
  constructor(
    @Inject(INVITATION_EMAIL_SENDER)
    private readonly invitationEmailSender: InvitationEmailSenderPort,
  ) {}

  async execute(job: SendInvitationEmailJob): Promise<void> {
    await this.invitationEmailSender.send(job.email, job.code, job.url, job.farmName);
  }
}
