import { Module } from '@nestjs/common';

import { ME_USER_REPOSITORY, UpdateMyProfileCommandHandler } from './application';
import { TypeOrmMeUserRepository } from './infra';
import { MeController } from './presentation';

const repositories = [TypeOrmMeUserRepository];
const commandHandlers = [UpdateMyProfileCommandHandler];

@Module({
  controllers: [MeController],
  providers: [
    {
      provide: ME_USER_REPOSITORY,
      useExisting: TypeOrmMeUserRepository,
    },
    ...repositories,
    ...commandHandlers,
  ],
})
export class MeModule {}
