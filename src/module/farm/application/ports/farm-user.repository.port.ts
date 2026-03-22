import { EntityManager } from 'typeorm';

import { FarmUser } from '../../domain';

export interface FarmUserRepositoryPort {
  has(farmId: string, userId: string): Promise<boolean>;
  findAndCountByUserIdWithFarmAndRole(userId: string, em?: EntityManager): Promise<[FarmUser[], number]>;
  findOneByFarmIdAndUserIdWithFarmAndRole(farmId: string, userId: string, em?: EntityManager): Promise<FarmUser | null>;
  findRoleIdByFarmIdAndUserId(farmId: string, userId: string, em?: EntityManager): Promise<string | null>;
  insert(
    farmUser: {
      farmId: string;
      userId: string;
      roleId: string | null;
    },
    em?: EntityManager,
  ): Promise<void>;
  delete(farmId: string, userId: string, em?: EntityManager): Promise<{ affected: boolean }>;
}
