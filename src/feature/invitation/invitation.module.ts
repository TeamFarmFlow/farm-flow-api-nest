import { Module } from '@nestjs/common';

import { Configuration } from '@app/config';
import { MailModule } from '@app/infra/mail';
import { FarmUser, FarmUserRepository, Invitation, InvitationRepository, Role, RoleRepository, TypeOrmExModule, User, UserRepository } from '@app/infra/persistence/typeorm';

import { InvitationService } from './application';
import { InvitationController } from './presentation';

@Module({
  imports: [
    TypeOrmExModule.forFeature([User, Role, FarmUser, Invitation], [UserRepository, RoleRepository, FarmUserRepository, InvitationRepository]),
    MailModule.registerAsync({
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        return configuration.mailOptions;
      },
    }),
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
