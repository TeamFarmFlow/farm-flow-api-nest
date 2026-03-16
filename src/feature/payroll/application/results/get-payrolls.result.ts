export type GetPayrollUser = {
  id: string;
  name: string;
};

export type GetPayrollRole = {
  id: string;
  name: string;
  super: boolean;
  required: boolean;
};

export type GetPayrollRow = {
  user: GetPayrollUser;
  role: GetPayrollRole | null;
  seconds: number;
  payRatePerHour: number;
  payDeductionAmount: number;
};

export type GetPayrollsResult = {
  total: number;
  rows: GetPayrollRow[];
};
