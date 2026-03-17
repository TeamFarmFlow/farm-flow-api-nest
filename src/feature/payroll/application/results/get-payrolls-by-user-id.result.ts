import { AttendanceStatus } from '@app/shared/domain';

export type GetPayrollByUserIdRow = {
  id: string;
  workDate: string;
  seconds: number;
  status: AttendanceStatus;
  checkedInAt: Date;
  checkedOutAt: Date | null;
};

export type GetPayrollsByUserIdResult = {
  total: number;
  payRatePerHour: number;
  payDeductionAmount: number;
  rows: GetPayrollByUserIdRow[];
};
