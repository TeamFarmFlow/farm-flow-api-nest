import { Inject, Injectable } from '@nestjs/common';

import { ROLE_REPOSITORY, RoleRepositoryPort } from '../ports';
import { CreateRoleResult } from '../results';

import { CreateRoleCommand } from './create-role.command';

@Injectable()
export class CreateRoleCommandHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(command: CreateRoleCommand): Promise<CreateRoleResult> {
    const role = await this.roleRepository.save({
      farmId: command.farmId,
      name: command.name,
      permissionKeys: command.permissionKeys,
    });

    return { id: role.id };
  }
}
