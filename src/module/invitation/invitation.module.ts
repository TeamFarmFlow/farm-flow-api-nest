import { Module } from '@nestjs/common';

import { Configuration } from '@app/config';
import { MailModule } from '@app/infra/mail';
import {
  FarmEntity,
  FarmRepository,
  FarmUserEntity,
  FarmUserRepository,
  RoleEntity,
  RoleRepository,
  TypeOrmExModule,
  UserEntity,
  UserRepository,
} from '@app/infra/persistence/typeorm';

import { InvitationService } from './application';
import { InvitationController } from './presentation';

@Module({
  imports: [
    TypeOrmExModule.forFeature([UserEntity, RoleEntity, FarmEntity, FarmUserEntity], [UserRepository, RoleRepository, FarmRepository, FarmUserRepository]),
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
