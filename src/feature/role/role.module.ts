import { Module, OnModuleInit } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { Configuration } from '@app/config';
import { NodeEnv } from '@app/config/enums';
import { FarmUser, FarmUserRepository, Role, RolePermission, RolePermissionRepository, RoleRepository, TypeOrmExModule } from '@app/infra/persistence/typeorm';
import { FARM_ADMIN_DEFAULT_PERMISSION_KEYS } from '@app/shared/domain';

import { PermissionGuardProvider } from './guards';

@Module({
  imports: [TypeOrmExModule.forFeature([Role, RolePermission, FarmUser], [RoleRepository, RolePermissionRepository, FarmUserRepository])],
  controllers: [],
  providers: [PermissionGuardProvider],
})
export class RoleModule implements OnModuleInit {
  constructor(
    private readonly configuration: Configuration,
    private readonly dataSource: DataSource,
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  async onModuleInit() {
    if (this.configuration.nodeEnv !== NodeEnv.Local) {
      return;
    }

    await this.dataSource.transaction(async (em) => {
      const roles = await this.roleRepository.findBySuper(em);
      const rolePermissions = roles.map((role) => FARM_ADMIN_DEFAULT_PERMISSION_KEYS.map((key) => ({ roleId: role.id, key })).flat()).flat();
      await this.rolePermissionRepository.upsert(rolePermissions, em);
    });
  }
}
