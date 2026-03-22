import { PermissionKey } from '@app/shared/domain';

export interface FarmRolePermissionRepositoryPort {
  findKeysByRoleId(roleId: string): Promise<PermissionKey[]>;
}
