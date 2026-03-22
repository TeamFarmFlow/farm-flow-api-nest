import { Inject, Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { FARM_ADMIN_DEFAULT_PERMISSION_KEYS, FARM_MEMBER_DEFAULT_PERMISSION_KEYS } from '@app/shared/domain';

import { ExceedFarmCountException } from '../../domain';
import {
  FARM_REPOSITORY,
  FARM_ROLE_REPOSITORY,
  FARM_USER_REPOSITORY,
  FARM_USER_USAGE_REPOSITORY,
  FarmRepositoryPort,
  FarmRoleRepositoryPort,
  FarmUserRepositoryPort,
  FarmUserUsageRepositoryPort,
} from '../ports';
import { CreateFarmResult } from '../results';

import { CreateFarmCommand } from './create-farm.command';

@Injectable()
export class CreateFarmCommandHandler {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: FarmRepositoryPort,
    @Inject(FARM_ROLE_REPOSITORY)
    private readonly farmRoleRepository: FarmRoleRepositoryPort,
    @Inject(FARM_USER_REPOSITORY)
    private readonly farmUserRepository: FarmUserRepositoryPort,
    @Inject(FARM_USER_USAGE_REPOSITORY)
    private readonly farmUserUsageRepository: FarmUserUsageRepositoryPort,
  ) {}

  async execute(command: CreateFarmCommand): Promise<CreateFarmResult> {
    const farm = await this.dataSource.transaction(async (em) => {
      const { affected } = await this.farmUserUsageRepository.tryIncreaseFarmCount(command.userId, em);

      if (!affected) {
        throw new ExceedFarmCountException();
      }

      const farm = await this.farmRepository.save(
        {
          name: command.name,
          payRatePerHour: command.payRatePerHour,
          payDeductionAmount: command.payDeductionAmount,
        },
        em,
      );

      const adminRole = await this.farmRoleRepository.save(
        {
          farmId: farm.id,
          name: '관리자',
          required: true,
          super: true,
          permissionKeys: FARM_ADMIN_DEFAULT_PERMISSION_KEYS,
        },
        em,
      );

      await this.farmRoleRepository.save(
        {
          farmId: farm.id,
          name: '기본',
          required: true,
          super: false,
          permissionKeys: FARM_MEMBER_DEFAULT_PERMISSION_KEYS,
        },
        em,
      );

      await this.farmUserRepository.insert(
        {
          farmId: farm.id,
          userId: command.userId,
          roleId: adminRole.id,
        },
        em,
      );

      return farm;
    });

    return { id: farm.id };
  }
}
