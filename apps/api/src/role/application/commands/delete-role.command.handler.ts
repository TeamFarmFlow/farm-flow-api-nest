import { Inject, Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { RoleNotFoundException, RoleProtectedException } from '../../domain';
import { ROLE_FARM_USER_REPOSITORY, ROLE_REPOSITORY, RoleFarmUserRepositoryPort, RoleRepositoryPort } from '../ports';

import { DeleteRoleCommand } from './delete-role.command';

@Injectable()
export class DeleteRoleCommandHandler {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
    @Inject(ROLE_FARM_USER_REPOSITORY)
    private readonly roleFarmUserRepository: RoleFarmUserRepositoryPort,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    const role = await this.roleRepository.findByIdWithPermissions(command.roleId);

    if (!role) {
      throw new RoleNotFoundException();
    }

    if (role.required) {
      throw new RoleProtectedException();
    }

    const defaultRole = await this.roleRepository.findDefault(role.farmId);

    await this.dataSource.transaction(async (em) => {
      await this.roleFarmUserRepository.updateRole(role.id, defaultRole.id, em);
      await this.roleRepository.delete(role.id, em);
    });
  }
}
