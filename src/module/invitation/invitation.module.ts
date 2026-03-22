import { Module } from '@nestjs/common';

import { Configuration } from '@app/config';
import { MailModule } from '@app/infra/mail';

import {
  CreateInvitationCommandHandler,
  INVITATION_FARM_REPOSITORY,
  INVITATION_FARM_USER_REPOSITORY,
  INVITATION_MAILER,
  INVITATION_ROLE_REPOSITORY,
  INVITATION_STORE,
  INVITATION_USER_REPOSITORY,
  ValidateInvitationCodeCommandHandler,
} from './application';
import {
  MailInvitationMailer,
  RedisInvitationStore,
  TypeOrmInvitationFarmRepository,
  TypeOrmInvitationFarmUserRepository,
  TypeOrmInvitationRoleRepository,
  TypeOrmInvitationUserRepository,
} from './infra';
import { InvitationController } from './presentation';

@Module({
  imports: [
    MailModule.registerAsync({
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        return configuration.mailOptions;
      },
    }),
  ],
  controllers: [InvitationController],
  providers: [
    {
      provide: INVITATION_STORE,
      useExisting: RedisInvitationStore,
    },
    {
      provide: INVITATION_MAILER,
      useExisting: MailInvitationMailer,
    },
    {
      provide: INVITATION_USER_REPOSITORY,
      useExisting: TypeOrmInvitationUserRepository,
    },
    {
      provide: INVITATION_FARM_REPOSITORY,
      useExisting: TypeOrmInvitationFarmRepository,
    },
    {
      provide: INVITATION_FARM_USER_REPOSITORY,
      useExisting: TypeOrmInvitationFarmUserRepository,
    },
    {
      provide: INVITATION_ROLE_REPOSITORY,
      useExisting: TypeOrmInvitationRoleRepository,
    },
    CreateInvitationCommandHandler,
    ValidateInvitationCodeCommandHandler,
    RedisInvitationStore,
    MailInvitationMailer,
    TypeOrmInvitationUserRepository,
    TypeOrmInvitationFarmRepository,
    TypeOrmInvitationFarmUserRepository,
    TypeOrmInvitationRoleRepository,
  ],
})
export class InvitationModule {}
