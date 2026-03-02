import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { FarmRepository, FarmUserRepository, UserUsageRepository } from '@app/infra/persistence/typeorm';

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
  ) {}

  // TODO join role, permission
  async getFarms(queries: GetFarmsQuery): Promise<GetFarmsResult> {
    const [rows, total] = await this.farmUserRepository.findAndCountByUserIdWithFarm(queries.userId);

    return { total, rows: rows.map((row) => row.farm) };
  }

  // TODO create role, permission
  async createFarm(command: CreateFarmCommand) {
    await this.dataSource.transaction(async (em) => {
      const { affected } = await this.userUsageRepository.tryIncreaseFarmCount(command.userId, em);

      if (!affected) {
        throw new ExceedFarmCountException();
      }

      const farm = await this.farmRepository.save({ name: command.name }, em);
      await this.farmUserRepository.insert({ farmId: farm.id, userId: command.userId }, em);

      return farm;
    });
  }

  // TODO check role, permission
  async updateFarm(command: UpdateFarmCommand) {
    const hasFarm = await this.farmUserRepository.has(command.farmId, command.userId);

    if (!hasFarm) {
      throw new FarmNotFoundException();
    }

    await this.farmRepository.update(command.farmId, { name: command.name });
  }

  // TODO check role, permission
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
