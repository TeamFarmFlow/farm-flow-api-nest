import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

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
import { PermissionGuard } from './guards';
import { TypeOrmRoleFarmUserRepository, TypeOrmRolePermissionRepository, TypeOrmRoleRepository } from './infra';
import { RoleController } from './presentation/role.controller';

const repositories = [TypeOrmRoleRepository, TypeOrmRolePermissionRepository, TypeOrmRoleFarmUserRepository];
const queryHandlers = [GetRoleDetailsQueryHandler, GetRolesQueryHandler];
const commandHandlers = [CreateRoleCommandHandler, UpdateRoleCommandHandler, DeleteRoleCommandHandler];

@Module({
  controllers: [RoleController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
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
    ...repositories,
    ...queryHandlers,
    ...commandHandlers,
  ],
})
export class RoleModule {}
