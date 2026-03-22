import { Module } from '@nestjs/common';

import {
  CreateRoleCommandHandler,
  DeleteRoleCommandHandler,
  GetRoleDetailsQueryHandler,
  GetRolesQueryHandler,
  ROLE_FARM_USER_REPOSITORY,
  ROLE_PERMISSION_REPOSITORY,
  ROLE_REPOSITORY,
  UpdateRoleCommandHandler,
} from './application';
import { PermissionGuardProvider } from './guards';
import { TypeOrmRoleFarmUserRepository, TypeOrmRolePermissionRepository, TypeOrmRoleRepository } from './infra';
import { RoleController } from './presentation/role.controller';

@Module({
  controllers: [RoleController],
  providers: [
    {
      provide: ROLE_REPOSITORY,
      useExisting: TypeOrmRoleRepository,
    },
    {
      provide: ROLE_PERMISSION_REPOSITORY,
      useExisting: TypeOrmRolePermissionRepository,
    },
    {
      provide: ROLE_FARM_USER_REPOSITORY,
      useExisting: TypeOrmRoleFarmUserRepository,
    },
    GetRoleDetailsQueryHandler,
    GetRolesQueryHandler,
    CreateRoleCommandHandler,
    UpdateRoleCommandHandler,
    DeleteRoleCommandHandler,
    TypeOrmRoleRepository,
    TypeOrmRolePermissionRepository,
    TypeOrmRoleFarmUserRepository,
    PermissionGuardProvider,
  ],
})
export class RoleModule {}
