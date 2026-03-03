import { SetMetadata } from '@nestjs/common';

import { PermissionKey } from '@app/shared/domain';

export const REQUIRED_PERMISSIONS_KEY = Symbol('REQUIRED_PERMISSIONS_KEY');

export type RequirePermissionsOptions = {
  mode?: 'ALL' | 'ANY';
  allowAdminWildcard?: boolean;
};

export const RequirePermissions = (permissions: PermissionKey[], options: RequirePermissionsOptions = {}) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, {
    permissions,
    options: {
      mode: 'ANY',
      allowAdminWildcard: true,
      ...options,
    },
  });
