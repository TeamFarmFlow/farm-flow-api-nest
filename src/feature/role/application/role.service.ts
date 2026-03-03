import { Injectable } from '@nestjs/common';

import { RolePermissionRepository, RoleRepository } from '@app/infra/persistence/typeorm';

import { CreateRoleCommand } from './commands';
import { GetRolesQuery } from './queries';
import { GetRolesResult } from './results';

@Injectable()
export class RoleService {
  constructor(
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
}
