import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { Configuration, ConfigurationModule } from '@libs/config';
import { QueueNames } from '@libs/shared';

import { InvitationEmailModule } from './invitation-email';

@Module({
  imports: [
    ConfigurationModule.forRoot(),
    BullModule.forRootAsync({
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        return { connection: configuration.redisOptions };
      },
    }),
    BullModule.registerQueue({ name: QueueNames.Email }),
    InvitationEmailModule.registerAsync({
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        return configuration.mailOptions;
      },
    }),
  ],
})
export class WorkerModule {}
