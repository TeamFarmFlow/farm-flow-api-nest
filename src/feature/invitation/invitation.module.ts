import { Module } from '@nestjs/common';

import { FarmUser, FarmUserRepository, Invitation, InvitationRepository, Role, RoleRepository, TypeOrmExModule, User, UserRepository } from '@app/infra/persistence/typeorm';

import { InvitationService } from './application';
import { InvitationController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([User, Role, FarmUser, Invitation], [UserRepository, RoleRepository, FarmUserRepository, InvitationRepository])],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
