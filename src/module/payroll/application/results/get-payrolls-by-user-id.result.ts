import { PayrollAttendance } from '../../domain';

export type GetPayrollsByUserIdResult = {
  total: number;
  payRatePerHour: number;
  payDeductionAmount: number;
  rows: PayrollAttendance[];
};
