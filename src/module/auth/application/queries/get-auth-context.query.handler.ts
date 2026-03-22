import { Inject, Injectable } from '@nestjs/common';

import {
  AUTH_FARM_USER_REPOSITORY,
  AUTH_ROLE_PERMISSION_REPOSITORY,
  AUTH_USER_REPOSITORY,
  AuthFarmUserRepositoryPort,
  AuthRolePermissionRepositoryPort,
  AuthUserRepositoryPort,
} from '../ports';
import { AuthResult } from '../result';

import { GetAuthContextQuery } from './get-auth-context.query';

@Injectable()
export class GetAuthContextQueryHandler {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly userRepository: AuthUserRepositoryPort,
    @Inject(AUTH_FARM_USER_REPOSITORY)
    private readonly farmUserRepository: AuthFarmUserRepositoryPort,
    @Inject(AUTH_ROLE_PERMISSION_REPOSITORY)
    private readonly rolePermissionRepository: AuthRolePermissionRepositoryPort,
  ) {}

  async execute(query: GetAuthContextQuery): Promise<AuthResult> {
    const user = await this.userRepository.findOneById(query.userId);

    if (!query.farmId) {
      return { user, farm: null, role: null };
    }

    const farmUser = await this.farmUserRepository.findOneByFarmIdAndUserId(query.farmId, query.userId);

    if (farmUser?.role) {
      farmUser.role.permissionKeys = await this.rolePermissionRepository.findKeysByRoleId(farmUser.role.id);
    }

    return {
      user,
      farm: farmUser?.farm ?? null,
      role: farmUser?.role ?? null,
    };
  }
}
