import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { EmailQueueJobNames, QueueNames, SendInvitationEmailJobData } from '@libs/shared';

import { SendInvitationEmailJob, SendInvitationEmailJobHandler } from './application';

@Processor(QueueNames.Email)
export class InvitationEmailProcessor extends WorkerHost {
  private readonly logger = new Logger(InvitationEmailProcessor.name);

  constructor(private readonly sendInvitationEmailJobHandler: SendInvitationEmailJobHandler) {
    super();
  }

  async process(job: Job<SendInvitationEmailJobData, void, EmailQueueJobNames>): Promise<void> {
    if (job.name !== EmailQueueJobNames.SendInvitationEmail) {
      this.logger.warn(`Unsupported email job received: ${String(job.name)}`);
      return;
    }

    const { email, code, url, farmName } = job.data;

    this.logger.log(`Processing invitation email job ${job.id ?? 'unknown'} for ${email}`);

    await this.sendInvitationEmailJobHandler.execute(new SendInvitationEmailJob(email, code, url, farmName));
  }
}
