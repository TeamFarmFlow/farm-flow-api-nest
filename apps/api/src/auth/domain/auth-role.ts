import { PermissionKey } from '@libs/shared';

export class AuthRole {
  id: string;
  name: string;
  required: boolean;
  super: boolean;
  permissionKeys: PermissionKey[];
}
