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
import { FarmController } from './presentation';

@Module({
  imports: [
    TypeOrmExModule.forFeature(
      [UserUsage, Farm, FarmUser, Role, RolePermission],
      [UserUsageRepository, FarmRepository, FarmUserRepository, RoleRepository, RolePermissionRepository],
    ),
  ],
  controllers: [FarmController],
  providers: [FarmService],
})
export class FarmModule {}
