import { Module } from '@nestjs/common';

import {
  FarmEntity,
  FarmRepository,
  FarmUserEntity,
  FarmUserRepository,
  RoleEntity,
  RolePermissionEntity,
  RolePermissionRepository,
  RoleRepository,
  TypeOrmExModule,
  UserUsageEntity,
  UserUsageRepository,
} from '@app/infra/persistence/typeorm';

import { FarmService } from './application';
import { FarmAuthGuardProvider } from './guards';
import { FarmController } from './presentation';

@Module({
  imports: [
    TypeOrmExModule.forFeature(
      [UserUsageEntity, FarmEntity, FarmUserEntity, RoleEntity, RolePermissionEntity],
      [UserUsageRepository, FarmRepository, FarmUserRepository, RoleRepository, RolePermissionRepository],
    ),
  ],
  controllers: [FarmController],
  providers: [FarmService, FarmAuthGuardProvider],
})
export class FarmModule {}
