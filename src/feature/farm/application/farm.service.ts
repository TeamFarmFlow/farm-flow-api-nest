import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { FarmRepository, FarmUserRepository, RolePermissionRepository, RoleRepository, UserUsageRepository } from '@app/infra/persistence/typeorm';
import { FARM_ADMIN_DEFAULT_PERMISSION_KEYS, FARM_MEMBER_DEFAULT_PERMISSION_KEYS, PermissionKey } from '@app/shared/domain';

import { ExceedFarmCountException, FarmNotFoundException, ForbiddenFarmUserException } from '../domain';

import { CreateFarmCommand, DeleteFarmCommand, UpdateFarmCommand } from './commands';
import { GetFarmQuery, GetFarmsQuery } from './queries';
import { CreateFarmResult, GetFarmResult, GetFarmsResult } from './results';

@Injectable()
export class FarmService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly farmRepository: FarmRepository,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly userUsageRepository: UserUsageRepository,
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  async getFarms(query: GetFarmsQuery): Promise<GetFarmsResult> {
    const [rows, total] = await this.farmUserRepository.findAndCountByUserIdWithFarmAndRole(query.userId);

    return {
      total,
      rows: rows.map((row) => ({
        farm: row.farm,
        role: row.role,
      })),
    };
  }

  async getFarm(query: GetFarmQuery): Promise<GetFarmResult> {
    const farm = await this.farmUserRepository.findOneWithFarmAndRole(query.farmId, query.userId);

    if (!farm) {
      throw new FarmNotFoundException();
    }

    return farm;
  }

  async createFarm(command: CreateFarmCommand): Promise<CreateFarmResult> {
    const farm = await this.dataSource.transaction(async (em) => {
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

    return { id: farm.id };
  }

  async updateFarm(command: UpdateFarmCommand): Promise<void> {
    const farmUser = await this.farmUserRepository.findWithRole(command.farmId, command.userId);

    if (!farmUser?.roleId) {
      throw new ForbiddenFarmUserException();
    }

    const permissions = await this.rolePermissionRepository.findKeysByRoleId(farmUser.roleId);
    const permissionKeys = permissions.map(({ key }) => key);

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

  async deleteFarm(command: DeleteFarmCommand): Promise<void> {
    const farmUser = await this.farmUserRepository.findWithRole(command.farmId, command.userId);

    if (!farmUser?.roleId) {
      throw new ForbiddenFarmUserException();
    }

    const permissions = await this.rolePermissionRepository.findKeysByRoleId(farmUser.roleId);
    const permissionKeys = permissions.map(({ key }) => key);

    if (!permissionKeys.includes(PermissionKey.FarmDelete)) {
      throw new ForbiddenFarmUserException();
    }

    await this.dataSource.transaction(async (em) => {
      const { affected } = await this.farmUserRepository.delete(command.farmId, command.userId, em);

      if (!affected) {
        throw new FarmNotFoundException();
      }

      await this.userUsageRepository.tryDecreaseFarmCount(command.userId, em);
    });
  }
}
