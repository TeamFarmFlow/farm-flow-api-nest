import { SetMetadata } from '@nestjs/common';

import { PermissionKey } from '@app/shared/domain';

export const REQUIRED_PERMISSIONS_KEY = Symbol('REQUIRED_PERMISSIONS_KEY');

export type RequiredPermissionsOptions = {
  mode: 'ALL' | 'ANY';
};

export type RequiredPermissionMetadata = {
  permissions: PermissionKey[];
  options: RequiredPermissionsOptions;
};

export const RequiredPermissions = (permissions: PermissionKey[], options: RequiredPermissionsOptions = { mode: 'ANY' }) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, {
    permissions,
    options,
  });
