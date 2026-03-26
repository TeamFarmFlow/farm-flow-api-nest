import { PayrollAttendance } from '../../domain';

export type GetPayrollTargetsByUserIdResult = {
  total: number;
  payRatePerHour: number;
  payDeductionAmount: number;
  rows: PayrollAttendance[];
};
