import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { RolePermission, RolePermissionRepository, RoleRepository } from '@app/infra/persistence/typeorm';

import { CreateRoleCommand, UpdateRoleCommand } from './commands';
import { GetRolesQuery } from './queries';
import { GetRolesResult } from './results';

@Injectable()
export class RoleService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  async getRoles(query: GetRolesQuery): Promise<GetRolesResult> {
    const [rows, total] = await this.roleRepository.findAndCountByFarmIdWithPermissions(query.farmId);

    return { total, rows };
  }

  async createRole(command: CreateRoleCommand): Promise<void> {
    await this.roleRepository.save({
      farmId: command.farmId,
      name: command.name,
      permissions: command.permissions.map((key) => ({ key })),
    });
  }

  async updateRole(command: UpdateRoleCommand): Promise<void> {
    const role = await this.roleRepository.findByIdWithPermissions(command.roleId);

    if (!role) {
      throw new Error('not found role');
    }

    if (role.required) {
      throw new Error('cannot update role');
    }

    const permissionSet = new Set(command.permissions);
    const permissions = [
      ...role.permissions.filter(({ key }) => permissionSet.has(key)),
      ...command.permissions.filter((key) => !role.permissions.some((permission) => permission.key === key)).map((key) => RolePermission.of(command.roleId, key)),
    ];

    await this.dataSource.transaction(async (em) => {
      await this.roleRepository.update(command.roleId, { name: command.name }, em);
      await this.rolePermissionRepository.saves(permissions, em);
    });
  }
}
