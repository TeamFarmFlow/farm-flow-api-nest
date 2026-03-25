import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { QueueNames } from '@libs/shared';

import {
  CreateInvitationCommandHandler,
  INVITATION_EMAIL_QUEUE,
  INVITATION_FARM_REPOSITORY,
  INVITATION_FARM_USER_REPOSITORY,
  INVITATION_ROLE_REPOSITORY,
  INVITATION_STORE,
  INVITATION_USER_REPOSITORY,
  ValidateInvitationCodeCommandHandler,
} from './application';
import {
  InvitationEmailQueue,
  RedisInvitationStore,
  TypeOrmInvitationFarmRepository,
  TypeOrmInvitationFarmUserRepository,
  TypeOrmInvitationRoleRepository,
  TypeOrmInvitationUserRepository,
} from './infra';
import { InvitationController } from './presentation';

const repositories = [TypeOrmInvitationUserRepository, TypeOrmInvitationFarmRepository, TypeOrmInvitationFarmUserRepository, TypeOrmInvitationRoleRepository];
const commandHandlers = [CreateInvitationCommandHandler, ValidateInvitationCodeCommandHandler];

@Module({
  imports: [BullModule.registerQueue({ name: QueueNames.Email })],
  controllers: [InvitationController],
  providers: [
    {
      provide: INVITATION_STORE,
      useExisting: RedisInvitationStore,
    },
    {
      provide: INVITATION_EMAIL_QUEUE,
      useExisting: InvitationEmailQueue,
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
    RedisInvitationStore,
    InvitationEmailQueue,
    ...repositories,
    ...commandHandlers,
  ],
})
export class InvitationModule {}
