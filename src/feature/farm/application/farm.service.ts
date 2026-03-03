import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { FarmRepository, FarmUserRepository, RoleRepository, UserUsageRepository } from '@app/infra/persistence/typeorm';
import { FARM_ADMIN_DEFAULT_PERMISSION_KEYS, FARM_MEMBER_DEFAULT_PERMISSION_KEYS } from '@app/shared/domain';

import { ExceedFarmCountException, FarmNotFoundException } from '../domain';

import { CreateFarmCommand, DeleteFarmCommand, UpdateFarmCommand } from './commands';
import { GetFarmsQuery } from './queries';
import { GetFarmsResult } from './results';

@Injectable()
export class FarmService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly farmRepository: FarmRepository,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly userUsageRepository: UserUsageRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async getFarms(queries: GetFarmsQuery): Promise<GetFarmsResult> {
    const [rows, total] = await this.farmUserRepository.findAndCountByUserIdWithFarm(queries.userId);

    return {
      total,
      rows: rows.map((row) => ({
        farm: row.farm,
        role: row.role,
      })),
    };
  }

  async createFarm(command: CreateFarmCommand) {
    await this.dataSource.transaction(async (em) => {
      const { affected } = await this.userUsageRepository.tryIncreaseFarmCount(command.userId, em);

      if (!affected) {
        throw new ExceedFarmCountException();
      }

      const farm = await this.farmRepository.save({ name: command.name }, em);
      const role = await this.roleRepository.save(
        { name: '관리자', permissions: FARM_ADMIN_DEFAULT_PERMISSION_KEYS.map((key) => ({ key })), required: true, super: true, farm },
        em,
      );
      await this.roleRepository.insert({ name: '기본', permissions: FARM_MEMBER_DEFAULT_PERMISSION_KEYS, required: true, farm }, em);
      await this.farmUserRepository.insert({ farmId: farm.id, userId: command.userId, role }, em);

      return farm;
    });
  }

  async updateFarm(command: UpdateFarmCommand) {
    const hasFarm = await this.farmUserRepository.has(command.farmId, command.userId);

    if (!hasFarm) {
      throw new FarmNotFoundException();
    }

    await this.farmRepository.update(command.farmId, { name: command.name });
  }

  async deleteFarm(command: DeleteFarmCommand) {
    const hasFarm = await this.farmUserRepository.has(command.farmId, command.userId);

    if (!hasFarm) {
      throw new FarmNotFoundException();
    }

    await this.dataSource.transaction(async (em) => {
      const { affected } = await this.farmUserRepository.delete(command.farmId, command.userId, em);

      if (affected) {
        await this.userUsageRepository.tryDecreaseFarmCount(command.userId, em);
      }
    });
  }
}
