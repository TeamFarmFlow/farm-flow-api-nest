import { Inject, Injectable } from '@nestjs/common';

import { ROLE_REPOSITORY, RoleRepositoryPort } from '../ports';
import { GetRolesResult } from '../results';

import { GetRolesQuery } from './get-roles.query';

@Injectable()
export class GetRolesQueryHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(query: GetRolesQuery): Promise<GetRolesResult> {
    const [rows, total] = await this.roleRepository.findAndCountByFarmIdWithPermissions(query.farmId);

    return { total, rows };
  }
}
