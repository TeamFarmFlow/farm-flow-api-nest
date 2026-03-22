import { Inject, Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { PermissionKey } from '@app/shared/domain';

import { FarmNotFoundException, ForbiddenFarmUserException } from '../../domain';
import {
  FARM_ROLE_PERMISSION_REPOSITORY,
  FARM_USER_REPOSITORY,
  FARM_USER_USAGE_REPOSITORY,
  FarmRolePermissionRepositoryPort,
  FarmUserRepositoryPort,
  FarmUserUsageRepositoryPort,
} from '../ports';

import { DeleteFarmCommand } from './delete-farm.command';

@Injectable()
export class DeleteFarmCommandHandler {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(FARM_USER_REPOSITORY)
    private readonly farmUserRepository: FarmUserRepositoryPort,
    @Inject(FARM_ROLE_PERMISSION_REPOSITORY)
    private readonly farmRolePermissionRepository: FarmRolePermissionRepositoryPort,
    @Inject(FARM_USER_USAGE_REPOSITORY)
    private readonly farmUserUsageRepository: FarmUserUsageRepositoryPort,
  ) {}

  async execute(command: DeleteFarmCommand): Promise<void> {
    const roleId = await this.farmUserRepository.findRoleIdByFarmIdAndUserId(command.farmId, command.userId);

    if (!roleId) {
      throw new ForbiddenFarmUserException();
    }

    const permissionKeys = await this.farmRolePermissionRepository.findKeysByRoleId(roleId);

    if (!permissionKeys.includes(PermissionKey.FarmDelete)) {
      throw new ForbiddenFarmUserException();
    }

    await this.dataSource.transaction(async (em) => {
      const { affected } = await this.farmUserRepository.delete(command.farmId, command.userId, em);

      if (!affected) {
        throw new FarmNotFoundException();
      }

      await this.farmUserUsageRepository.tryDecreaseFarmCount(command.userId, em);
    });
  }
}
