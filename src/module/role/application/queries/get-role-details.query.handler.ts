import { Inject, Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { RoleNotFoundException } from '../../domain';
import { ROLE_FARM_USER_REPOSITORY, ROLE_REPOSITORY, RoleFarmUserRepositoryPort, RoleRepositoryPort } from '../ports';
import { GetRoleDetailsResult } from '../results';

import { GetRoleDetailsQuery } from './get-role-details.query';

@Injectable()
export class GetRoleDetailsQueryHandler {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
    @Inject(ROLE_FARM_USER_REPOSITORY)
    private readonly roleFarmUserRepository: RoleFarmUserRepositoryPort,
  ) {}

  async execute(query: GetRoleDetailsQuery): Promise<GetRoleDetailsResult> {
    return this.dataSource.transaction(async (em) => {
      const role = await this.roleRepository.findByIdWithPermissions(query.roleId, em);

      if (!role) {
        throw new RoleNotFoundException();
      }

      const users = await this.roleFarmUserRepository.findUsersByRoleId(role.id, em);

      return { role, users };
    });
  }
}
