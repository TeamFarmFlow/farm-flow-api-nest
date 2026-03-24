import { Inject, Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { RoleNotFoundException, RoleProtectedException } from '../../domain';
import { ROLE_PERMISSION_REPOSITORY, ROLE_REPOSITORY, RolePermissionRepositoryPort, RoleRepositoryPort } from '../ports';

import { UpdateRoleCommand } from './update-role.command';

@Injectable()
export class UpdateRoleCommandHandler {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
    @Inject(ROLE_PERMISSION_REPOSITORY)
    private readonly rolePermissionRepository: RolePermissionRepositoryPort,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<void> {
    const role = await this.roleRepository.findByIdWithPermissions(command.roleId);

    if (!role) {
      throw new RoleNotFoundException();
    }

    if (role.required) {
      throw new RoleProtectedException();
    }

    const permissionSet = new Set(command.permissionKeys);
    const deletePermissionIds = role.permissions.filter(({ key }) => !permissionSet.has(key)).map((permission) => permission.id);
    const nextPermissions = [
      ...role.permissions.filter(({ key }) => permissionSet.has(key)).map((permission) => ({ id: permission.id, roleId: permission.roleId, key: permission.key })),
      ...command.permissionKeys.filter((key) => !role.permissions.some((permission) => permission.key === key)).map((key) => ({ roleId: command.roleId, key })),
    ];

    await this.dataSource.transaction(async (em) => {
      await this.roleRepository.update(command.roleId, { name: command.name }, em);
      await this.rolePermissionRepository.saveAll(nextPermissions, em);
      await this.rolePermissionRepository.deleteInIds(deletePermissionIds, em);
    });
  }
}
