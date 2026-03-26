import { PayrollTarget } from '../../domain';

export type GetPayrollTargetsResult = {
  total: number;
  rows: PayrollTarget[];
};
