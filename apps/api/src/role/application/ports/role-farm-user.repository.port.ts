import { EntityManager } from 'typeorm';

import { Role, RoleUser } from '../../domain';

export interface RoleFarmUserRepositoryPort {
  findRole(farmId: string, userId: string): Promise<Role | null>;
  findUsersByRoleId(roleId: string, em?: EntityManager): Promise<RoleUser[]>;
  updateRole(currentRoleId: string, updateRoleId: string, em?: EntityManager): Promise<void>;
}
