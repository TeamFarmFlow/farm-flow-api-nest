export enum PermissionKey {
  FarmAdministrator = 'farm.*',
  FarmInviteMember = 'farm.invitation.create',
  FarmUpdate = 'farm.update',
  FarmDelete = 'farm.delete',
  FarmRoleManagement = 'farm.role.management',
}

export const FARM_ADMIN_DEFAULT_PERMISSION_KEYS = Object.values(PermissionKey).filter((key) => !key.includes('*'));
export const FARM_MEMBER_DEFAULT_PERMISSION_KEYS = [];
