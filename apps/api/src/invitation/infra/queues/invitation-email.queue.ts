import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { EmailQueueJobNames, QueueNames, SendInvitationEmailJobData } from '@libs/shared';

import { InvitationEmailQueuePort } from '../../application';

@Injectable()
export class InvitationEmailQueue implements InvitationEmailQueuePort {
  constructor(
    @InjectQueue(QueueNames.Email)
    private readonly emailQueue: Queue<SendInvitationEmailJobData>,
  ) {}

  async add(email: string, code: string, url: string, farmName: string): Promise<void> {
    await this.emailQueue.add(
      EmailQueueJobNames.SendInvitationEmail,
      { email, code, url, farmName },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    );
  }
}
