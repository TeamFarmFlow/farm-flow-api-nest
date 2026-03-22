import { EntityManager } from 'typeorm';

import { PermissionKey } from '@libs/shared';

export interface RolePermissionRepositoryPort {
  findKeysByRoleId(id: string): Promise<PermissionKey[]>;
  saveAll(permissions: Array<{ id?: string; roleId: string; key: PermissionKey }>, em?: EntityManager): Promise<void>;
  deleteInIds(ids: string[], em?: EntityManager): Promise<void>;
}
