export type UpdateMemberPayrollCommand = {
  farmId: string;
  userId: string;
  payRatePerHour?: number;
  payDeductionAmount?: number;
};
