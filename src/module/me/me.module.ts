import { Module } from '@nestjs/common';

import { TypeOrmExModule, UserEntity, UserRepository } from '@app/infra/persistence/typeorm';

import { MeService } from './application';
import { MeController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([UserEntity], [UserRepository])],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
