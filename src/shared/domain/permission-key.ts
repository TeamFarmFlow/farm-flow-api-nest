export enum PermissionKeyWildCard {
  Administrator = '*',
}

export enum PermissionKey {
  InvitationCreate = 'invitation.create',
  AttendanceQrCreate = 'attendance.qr.create',
  FarmUpdate = 'farm.update',
  FarmDelete = 'farm.delete',
  RoleRead = 'role.read',
  RoleCreate = 'role.create',
  RoleUpdate = 'role.update',
  RoleRemove = 'role.remove',
  MemberRead = 'member.read',
  MemberRoleUpdate = 'member.role.update',
  MemberPayUpdate = 'member.pay.update',
  MemberRemove = 'member.remove',
  PayrollRead = 'payroll.read',
  PayrollCheck = 'payroll.check',
  PayrollAttendanceHistoryUpdate = 'payroll.attendance.history.update',
  PayrollAttendanceHistoryDelete = 'payroll.attendance.history.delete',
}

export const FARM_ADMIN_DEFAULT_PERMISSION_KEYS = Object.values(PermissionKey);
export const FARM_MEMBER_DEFAULT_PERMISSION_KEYS = [];
