import { PermissionKey } from '@libs/shared';

export type CreateRoleCommand = {
  farmId: string;
  name: string;
  permissionKeys: PermissionKey[];
};
