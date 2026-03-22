import { Payroll } from '../../domain';

export type GetPayrollsResult = {
  total: number;
  rows: Payroll[];
};
