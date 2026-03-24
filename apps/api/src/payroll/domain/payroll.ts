import { PayrollRole } from './payroll-role';
import { PayrollUser } from './payroll-user';

export class Payroll {
  user: PayrollUser;
  role: PayrollRole | null;
  seconds: number;
  payRatePerHour: number;
  payDeductionAmount: number;
  needCheck: boolean;
}
