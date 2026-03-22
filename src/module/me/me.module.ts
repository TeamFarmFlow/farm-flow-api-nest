import { Module } from '@nestjs/common';

import { ME_USER_REPOSITORY, UpdateMyProfileCommandHandler } from './application';
import { TypeOrmMeUserRepository } from './infra';
import { MeController } from './presentation';

@Module({
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
