import { AttendanceEntity, FarmUserEntity } from '@libs/persistence/typeorm';

import { PayrollAttendance, PayrollFarmUser, PayrollTarget, PayrollTargetRole, PayrollUser } from '../../domain';

type AttendancePayrollRawRow = {
  user_id: string;
  user_name: string;
  role_id: string | null;
  role_name: string | null;
  role_super: boolean | null;
  role_required: boolean | null;
  pay_rate_per_hour: number;
  pay_deduction_amount: number;
  seconds: string | number;
  need_check: boolean;
};

export class PayrollTypeOrmMapper {
  static toPayrollTarget(raw: AttendancePayrollRawRow): PayrollTarget {
    const payrollTarget = new PayrollTarget();
    const user = new PayrollUser();

    user.id = raw.user_id;
    user.name = raw.user_name;

    payrollTarget.user = user;
    payrollTarget.role = raw.role_id ? this.toPayrollTargetRole(raw) : null;
    payrollTarget.payRatePerHour = raw.pay_rate_per_hour;
    payrollTarget.payDeductionAmount = raw.pay_deduction_amount;
    payrollTarget.seconds = Number(raw.seconds);
    payrollTarget.needCheck = raw.need_check;

    return payrollTarget;
  }

  static toPayrollTargetRole(raw: AttendancePayrollRawRow): PayrollTargetRole {
    const payrollRole = new PayrollTargetRole();

    payrollRole.id = raw.role_id!;
    payrollRole.name = raw.role_name!;
    payrollRole.super = raw.role_super!;
    payrollRole.required = raw.role_required!;

    return payrollRole;
  }

  static toPayrollAttendance(attendance: AttendanceEntity): PayrollAttendance {
    const payrollAttendance = new PayrollAttendance();

    payrollAttendance.id = attendance.id;
    payrollAttendance.workDate = attendance.workDate;
    payrollAttendance.seconds = attendance.seconds;
    payrollAttendance.status = attendance.status;
    payrollAttendance.payrolled = attendance.payrolled;
    payrollAttendance.checkedInAt = attendance.checkedInAt;
    payrollAttendance.checkedOutAt = attendance.checkedOutAt;

    return payrollAttendance;
  }

  static toPayrollFarmUser(farmUser: FarmUserEntity): PayrollFarmUser {
    const payrollFarmUser = new PayrollFarmUser();

    payrollFarmUser.payRatePerHour = farmUser.payRatePerHour;
    payrollFarmUser.payDeductionAmount = farmUser.payDeductionAmount;

    return payrollFarmUser;
  }
}
