import { EntityManager } from 'typeorm';

import { Role, RoleUser } from '../../domain';

export interface RoleFarmUserRepositoryPort {
  findWithRole(farmId: string, userId: string): Promise<{ user: RoleUser; role: Role | null }>;
  findUsersByRoleId(roleId: string, em?: EntityManager): Promise<RoleUser[]>;
  updateRole(currentRoleId: string, updateRoleId: string, em?: EntityManager): Promise<void>;
}
