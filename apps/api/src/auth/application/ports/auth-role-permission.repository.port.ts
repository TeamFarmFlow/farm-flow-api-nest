import { PermissionKey } from '@libs/shared';

export interface AuthRolePermissionRepositoryPort {
  findKeysByRoleId(roleId: string): Promise<PermissionKey[]>;
}
