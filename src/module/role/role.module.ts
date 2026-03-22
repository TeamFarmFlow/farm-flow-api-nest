import { Module } from '@nestjs/common';

import { FarmUserEntity, FarmUserRepository, RoleEntity, RolePermissionEntity, RolePermissionRepository, RoleRepository, TypeOrmExModule } from '@app/infra/persistence/typeorm';

import { RoleService } from './application';
import { PermissionGuardProvider } from './guards';
import { RoleController } from './presentation/role.controller';

@Module({
  imports: [TypeOrmExModule.forFeature([RoleEntity, RolePermissionEntity, FarmUserEntity], [RoleRepository, RolePermissionRepository, FarmUserRepository])],
  controllers: [RoleController],
  providers: [RoleService, PermissionGuardProvider],
})
export class RoleModule {}
