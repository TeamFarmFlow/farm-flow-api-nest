import { Inject, Injectable } from '@nestjs/common';

import { PermissionKey } from '@libs/shared';

import { FarmNotFoundException, ForbiddenFarmUserException } from '../../domain';
import { FARM_REPOSITORY, FARM_ROLE_PERMISSION_REPOSITORY, FARM_USER_REPOSITORY, FarmRepositoryPort, FarmRolePermissionRepositoryPort, FarmUserRepositoryPort } from '../ports';

import { UpdateFarmCommand } from './update-farm.command';

@Injectable()
export class UpdateFarmCommandHandler {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: FarmRepositoryPort,
    @Inject(FARM_USER_REPOSITORY)
    private readonly farmUserRepository: FarmUserRepositoryPort,
    @Inject(FARM_ROLE_PERMISSION_REPOSITORY)
    private readonly farmRolePermissionRepository: FarmRolePermissionRepositoryPort,
  ) {}

  async execute(command: UpdateFarmCommand): Promise<void> {
    const roleId = await this.farmUserRepository.findRoleIdByFarmIdAndUserId(command.farmId, command.userId);

    if (!roleId) {
      throw new ForbiddenFarmUserException();
    }

    const permissionKeys = await this.farmRolePermissionRepository.findKeysByRoleId(roleId);

    if (!permissionKeys.includes(PermissionKey.FarmUpdate)) {
      throw new ForbiddenFarmUserException();
    }

    const { affected } = await this.farmRepository.update(command.farmId, {
      name: command.name,
      payRatePerHour: command.payRatePerHour,
      payDeductionAmount: command.payDeductionAmount,
    });

    if (!affected) {
      throw new FarmNotFoundException();
    }
  }
}
