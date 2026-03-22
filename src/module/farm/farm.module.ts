import { Module } from '@nestjs/common';

import {
  CreateFarmCommandHandler,
  DeleteFarmCommandHandler,
  FARM_REPOSITORY,
  FARM_ROLE_PERMISSION_REPOSITORY,
  FARM_ROLE_REPOSITORY,
  FARM_USER_REPOSITORY,
  FARM_USER_USAGE_REPOSITORY,
  GetFarmQueryHandler,
  GetFarmsQueryHandler,
  UpdateFarmCommandHandler,
} from './application';
import { FarmAuthGuardProvider } from './guards';
import {
  TypeOrmFarmRepositoryAdapter,
  TypeOrmFarmRolePermissionRepositoryAdapter,
  TypeOrmFarmRoleRepositoryAdapter,
  TypeOrmFarmUserRepositoryAdapter,
  TypeOrmFarmUserUsageRepositoryAdapter,
} from './infra';
import { FarmController } from './presentation';

@Module({
  controllers: [FarmController],
  providers: [
    {
      provide: FARM_REPOSITORY,
      useExisting: TypeOrmFarmRepositoryAdapter,
    },
    {
      provide: FARM_USER_REPOSITORY,
      useExisting: TypeOrmFarmUserRepositoryAdapter,
    },
    {
      provide: FARM_ROLE_REPOSITORY,
      useExisting: TypeOrmFarmRoleRepositoryAdapter,
    },
    {
      provide: FARM_ROLE_PERMISSION_REPOSITORY,
      useExisting: TypeOrmFarmRolePermissionRepositoryAdapter,
    },
    {
      provide: FARM_USER_USAGE_REPOSITORY,
      useExisting: TypeOrmFarmUserUsageRepositoryAdapter,
    },
    GetFarmsQueryHandler,
    GetFarmQueryHandler,
    CreateFarmCommandHandler,
    UpdateFarmCommandHandler,
    DeleteFarmCommandHandler,
    TypeOrmFarmRepositoryAdapter,
    TypeOrmFarmUserRepositoryAdapter,
    TypeOrmFarmRoleRepositoryAdapter,
    TypeOrmFarmRolePermissionRepositoryAdapter,
    TypeOrmFarmUserUsageRepositoryAdapter,
    FarmAuthGuardProvider,
  ],
})
export class FarmModule {}
