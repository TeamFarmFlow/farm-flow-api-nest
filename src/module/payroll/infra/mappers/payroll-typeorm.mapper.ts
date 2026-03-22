import { AttendanceEntity, FarmUserEntity } from '@app/infra/persistence/typeorm';

import { Payroll, PayrollAttendance, PayrollFarmUser, PayrollRole, PayrollUser } from '../../domain';

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
  static toPayroll(raw: AttendancePayrollRawRow): Payroll {
    const payroll = new Payroll();
    const user = new PayrollUser();

    user.id = raw.user_id;
    user.name = raw.user_name;

    payroll.user = user;
    payroll.role = raw.role_id
      ? Object.assign(new PayrollRole(), {
          id: raw.role_id,
          name: raw.role_name!,
          super: raw.role_super!,
          required: raw.role_required!,
        })
      : null;
    payroll.payRatePerHour = raw.pay_rate_per_hour;
    payroll.payDeductionAmount = raw.pay_deduction_amount;
    payroll.seconds = Number(raw.seconds);
    payroll.needCheck = raw.need_check;

    return payroll;
  }

  static toPayrollAttendance(attendance: AttendanceEntity): PayrollAttendance {
    const payrollAttendance = new PayrollAttendance();

    payrollAttendance.id = attendance.id;
    payrollAttendance.workDate = attendance.workDate;
    payrollAttendance.seconds = attendance.seconds;
    payrollAttendance.status = attendance.status;
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
