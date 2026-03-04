import { Module } from '@nestjs/common';

import { FarmUser, FarmUserRepository, Invitation, InvitationRepository, Role, RoleRepository, TypeOrmExModule } from '@app/infra/persistence/typeorm';

import { InvitationService } from './application';
import { InvitationController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([Invitation, FarmUser, Role], [InvitationRepository, FarmUserRepository, RoleRepository])],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
