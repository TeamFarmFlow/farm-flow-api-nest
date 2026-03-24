import { PermissionKey } from '@libs/shared';

export interface FarmRolePermissionRepositoryPort {
  findKeysByRoleId(roleId: string): Promise<PermissionKey[]>;
}
