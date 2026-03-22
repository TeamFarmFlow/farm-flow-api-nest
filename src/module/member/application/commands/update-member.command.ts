export type UpdateMemberCommand = {
  farmId: string;
  userId: string;
  roleId?: string;
  payRatePerHour?: number;
  payDeductionAmount?: number;
};
