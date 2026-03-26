import { PayrollTargetRole } from './payroll-role';
import { PayrollUser } from './payroll-user';

export class PayrollTarget {
  user: PayrollUser;
  role: PayrollTargetRole | null;
  seconds: number;
  payRatePerHour: number;
  payDeductionAmount: number;
  needCheck: boolean;
}
