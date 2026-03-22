import { Module } from '@nestjs/common';

import { FarmUser, FarmUserRepository, Role, RolePermission, RolePermissionRepository, RoleRepository, TypeOrmExModule } from '@app/infra/persistence/typeorm';

import { RoleService } from './application';
import { PermissionGuardProvider } from './guards';
import { RoleController } from './presentation/role.controller';

@Module({
  imports: [TypeOrmExModule.forFeature([Role, RolePermission, FarmUser], [RoleRepository, RolePermissionRepository, FarmUserRepository])],
  controllers: [RoleController],
  providers: [RoleService, PermissionGuardProvider],
})
export class RoleModule {}
