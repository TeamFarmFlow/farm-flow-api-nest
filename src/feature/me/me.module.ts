import { Module } from '@nestjs/common';

import { TypeOrmExModule, User, UserRepository } from '@app/infra/persistence/typeorm';

import { MeService } from './application';
import { MeController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([User], [UserRepository])],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
