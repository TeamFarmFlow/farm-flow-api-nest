import { Module } from '@nestjs/common';

import {
  Farm,
  FarmRepository,
  FarmUser,
  FarmUserRepository,
  Role,
  RolePermission,
  RolePermissionRepository,
  RoleRepository,
  TypeOrmExModule,
  UserUsage,
  UserUsageRepository,
} from '@app/infra/persistence/typeorm';

import { FarmService } from './application';
import { FarmAuthGuardProvider } from './guards';
import { FarmController } from './presentation';

@Module({
  imports: [
    TypeOrmExModule.forFeature(
      [UserUsage, Farm, FarmUser, Role, RolePermission],
      [UserUsageRepository, FarmRepository, FarmUserRepository, RoleRepository, RolePermissionRepository],
    ),
  ],
  controllers: [FarmController],
  providers: [FarmService, FarmAuthGuardProvider],
})
export class FarmModule {}
