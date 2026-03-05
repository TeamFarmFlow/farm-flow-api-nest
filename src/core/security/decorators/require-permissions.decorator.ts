import { SetMetadata } from '@nestjs/common';

import { PermissionKey, PermissionKeyWildCard } from '@app/shared/domain';

import { REQUIRED_PERMISSIONS_KEY } from '../constants';

export type RequiredPermissionsOptions = {
  mode: 'ALL' | 'ANY';
};

export type RequiredPermissionMetadata = {
  permissions: (PermissionKey | PermissionKeyWildCard)[];
  options: RequiredPermissionsOptions;
};

export const RequiredPermissions = (permissions: (PermissionKey | PermissionKeyWildCard)[], options: RequiredPermissionsOptions = { mode: 'ANY' }) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, {
    permissions,
    options,
  });
