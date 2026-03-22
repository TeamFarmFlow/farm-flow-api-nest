import { PermissionKey } from '@app/shared/domain';

export class RolePermission {
  id: string;
  roleId: string;
  key: PermissionKey;
}
