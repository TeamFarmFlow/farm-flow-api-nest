import { Module } from '@nestjs/common';

import { TypeOrmExModule, UserEntity, UserRepository } from '@app/infra/persistence/typeorm';

import { ME_USER_REPOSITORY, UpdateMyProfileCommandHandler } from './application';
import { TypeOrmMeUserRepository } from './infra';
import { MeController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([UserEntity], [UserRepository])],
  controllers: [MeController],
  providers: [
    {
      provide: ME_USER_REPOSITORY,
      useExisting: TypeOrmMeUserRepository,
    },
    UpdateMyProfileCommandHandler,
    TypeOrmMeUserRepository,
  ],
})
export class MeModule {}
