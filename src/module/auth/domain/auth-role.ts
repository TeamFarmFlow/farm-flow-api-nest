import { PermissionKey } from '@app/shared/domain';

export class AuthRole {
  id: string;
  name: string;
  required: boolean;
  super: boolean;
  permissionKeys: PermissionKey[];
}
