export type UpdateFarmCommand = {
  farmId: string;
  userId: string;
  name?: string;
  payRatePerHour?: number;
  payDeductionAmount?: number;
};
