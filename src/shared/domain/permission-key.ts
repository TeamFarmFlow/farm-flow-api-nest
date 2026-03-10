export enum PermissionKeyWildCard {
  Administrator = '*',
}

export enum PermissionKey {
  InvitationCreate = 'invitation.create',
  AttendanceQrCreate = 'attendance.qr.create',
  Update = 'update',
  Delete = 'delete',
  RoleManagement = 'role.management',
  MemberRead = 'member.read',
  MemberRoleUpdate = 'member.role.update',
  MemberRemove = 'member.remove',
}

export const FARM_ADMIN_DEFAULT_PERMISSION_KEYS = Object.values(PermissionKey);
export const FARM_MEMBER_DEFAULT_PERMISSION_KEYS = [];
