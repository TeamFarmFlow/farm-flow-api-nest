import { PermissionKey } from '@app/shared/domain';

export type UpdateRoleCommand = {
  roleId: string;
  name: string;
  permissions: PermissionKey[];
};
