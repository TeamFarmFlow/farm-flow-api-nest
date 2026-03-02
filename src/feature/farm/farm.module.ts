import { Module } from '@nestjs/common';

import { Farm, FarmRepository, FarmUser, FarmUserRepository, TypeOrmExModule, UserUsage, UserUsageRepository } from '@app/infra/persistence/typeorm';

import { FarmService } from './application';
import { FarmController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([Farm, FarmUser, UserUsage], [FarmRepository, FarmUserRepository, UserUsageRepository])],
  controllers: [FarmController],
  providers: [FarmService],
})
export class FarmModule {}
