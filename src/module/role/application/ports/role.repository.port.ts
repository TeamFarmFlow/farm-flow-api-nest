import { EntityManager } from 'typeorm';

import { PermissionKey } from '@app/shared/domain';

import { Role } from '../../domain';

export interface RoleRepositoryPort {
  findByIdWithPermissions(id: string, em?: EntityManager): Promise<Role | null>;
  findAndCountByFarmIdWithPermissions(farmId: string, em?: EntityManager): Promise<[Role[], number]>;
  findDefault(farmId: string, em?: EntityManager): Promise<Role>;
  save(role: { farmId: string; name: string; permissionKeys: PermissionKey[] }, em?: EntityManager): Promise<Role>;
  update(id: string, role: { name: string }, em?: EntityManager): Promise<void>;
  delete(id: string, em?: EntityManager): Promise<void>;
}
