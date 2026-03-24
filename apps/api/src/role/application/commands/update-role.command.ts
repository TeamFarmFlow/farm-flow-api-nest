import { PermissionKey } from '@libs/shared';

export type UpdateRoleCommand = {
  roleId: string;
  name: string;
  permissionKeys: PermissionKey[];
};
