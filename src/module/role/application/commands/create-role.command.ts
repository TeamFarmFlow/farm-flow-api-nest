import { PermissionKey } from '@app/shared/domain';

export type CreateRoleCommand = {
  farmId: string;
  name: string;
  permissionKeys: PermissionKey[];
};
