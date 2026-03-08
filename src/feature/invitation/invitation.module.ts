import { Module } from '@nestjs/common';

import { Configuration } from '@app/config';
import { MailModule } from '@app/infra/mail';
import { Farm, FarmRepository, FarmUser, FarmUserRepository, Role, RoleRepository, TypeOrmExModule, User, UserRepository } from '@app/infra/persistence/typeorm';

import { InvitationService } from './application';
import { InvitationController } from './presentation';

@Module({
  imports: [
    TypeOrmExModule.forFeature([User, Role, Farm, FarmUser], [UserRepository, RoleRepository, FarmRepository, FarmUserRepository]),
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
