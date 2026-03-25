import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

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
import { FarmAuthGuard } from './guards';
import { TypeOrmFarmRepository, TypeOrmFarmRolePermissionRepository, TypeOrmFarmRoleRepository, TypeOrmFarmUserRepository, TypeOrmFarmUserUsageRepository } from './infra';
import { FarmController } from './presentation';

const repositories = [TypeOrmFarmRepository, TypeOrmFarmUserRepository, TypeOrmFarmRoleRepository, TypeOrmFarmRolePermissionRepository, TypeOrmFarmUserUsageRepository];
const queryHandlers = [GetFarmsQueryHandler, GetFarmQueryHandler];
const commandHandlers = [CreateFarmCommandHandler, UpdateFarmCommandHandler, DeleteFarmCommandHandler];

@Module({
  controllers: [FarmController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: FarmAuthGuard,
    },
    {
      provide: FARM_REPOSITORY,
      useExisting: TypeOrmFarmRepository,
    },
    {
      provide: FARM_USER_REPOSITORY,
      useExisting: TypeOrmFarmUserRepository,
    },
    {
      provide: FARM_ROLE_REPOSITORY,
      useExisting: TypeOrmFarmRoleRepository,
    },
    {
      provide: FARM_ROLE_PERMISSION_REPOSITORY,
      useExisting: TypeOrmFarmRolePermissionRepository,
    },
    {
      provide: FARM_USER_USAGE_REPOSITORY,
      useExisting: TypeOrmFarmUserUsageRepository,
    },
    ...repositories,
    ...queryHandlers,
    ...commandHandlers,
  ],
})
export class FarmModule {}
