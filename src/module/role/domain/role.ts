import { PermissionKey } from '@app/shared/domain';

import { RolePermission } from './role-permission';

export class Role {
  id: string;
  name: string;
  super: boolean;
  required: boolean;
  farmId: string;
  permissionKeys: PermissionKey[];
  permissions: RolePermission[];
}
