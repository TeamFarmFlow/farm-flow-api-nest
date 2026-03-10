import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { FarmUserRepository, RolePermission, RolePermissionRepository, RoleRepository } from '@app/infra/persistence/typeorm';

import { RoleNotFoundException, RoleProtectedException } from '../domain';

import { CreateRoleCommand, UpdateRoleCommand } from './commands';
import { GetRolesQuery } from './queries';
import { CreateRoleResult, GetRoleDetailsResult, GetRolesResult } from './results';

@Injectable()
export class RoleService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly farmUserRepository: FarmUserRepository,
  ) {}

  async getRoleDetails(id: string): Promise<GetRoleDetailsResult> {
    return this.dataSource.transaction(async (em) => {
      const role = await this.roleRepository.findByIdWithPermissions(id, em);

      if (!role) {
        throw new RoleNotFoundException();
      }

      const farmUsers = await this.farmUserRepository.findByRoleIdWithUser(role.id, em);
      const users = farmUsers.map((farmUser) => farmUser.user);

      return { role, users };
    });
  }

  async getRoles(query: GetRolesQuery): Promise<GetRolesResult> {
    const [rows, total] = await this.roleRepository.findAndCountByFarmIdWithPermissions(query.farmId);

    return { total, rows };
  }

  async createRole(command: CreateRoleCommand): Promise<CreateRoleResult> {
    const role = await this.roleRepository.save({
      farmId: command.farmId,
      name: command.name,
      permissions: command.permissions.map((key) => ({ key })),
    });

    return { id: role.id };
  }

  async updateRole(command: UpdateRoleCommand): Promise<void> {
    const role = await this.roleRepository.findByIdWithPermissions(command.roleId);

    if (!role) {
      throw new RoleNotFoundException();
    }

    if (role.required) {
      throw new RoleProtectedException();
    }

    const permissionSet = new Set(command.permissions);
    const deletePermissions = role.permissions.filter(({ key }) => !permissionSet.has(key)).map((permission) => permission.id);

    const permissions = [
      ...role.permissions.filter(({ key }) => permissionSet.has(key)),
      ...command.permissions.filter((key) => !role.permissions.some((permission) => permission.key === key)).map((key) => RolePermission.of(command.roleId, key)),
    ];

    await this.dataSource.transaction(async (em) => {
      await this.roleRepository.update(command.roleId, { name: command.name }, em);
      await this.rolePermissionRepository.saves(permissions, em);
      await this.rolePermissionRepository.deleteInIds(deletePermissions);
    });
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.roleRepository.findByIdWithPermissions(id);

    if (!role) {
      throw new RoleNotFoundException();
    }

    if (role.required) {
      throw new RoleProtectedException();
    }

    const defaultRole = await this.roleRepository.findDefault(role.farmId);

    await this.dataSource.transaction(async (em) => {
      await this.farmUserRepository.updateRole(role.id, defaultRole.id, em);
      await this.roleRepository.delete(role.id);
    });
  }
}
