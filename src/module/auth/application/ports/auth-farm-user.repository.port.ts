import { EntityManager } from 'typeorm';

import { AuthFarmUser } from '../../domain';

export interface AuthFarmUserRepositoryPort {
  findOneByFarmIdAndUserId(farmId: string, userId: string, em?: EntityManager): Promise<AuthFarmUser | null>;
}
