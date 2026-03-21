import { PermissionKey } from '@app/shared/domain';

export interface AuthRolePermissionRepositoryPort {
  findKeysByRoleId(roleId: string): Promise<PermissionKey[]>;
}
