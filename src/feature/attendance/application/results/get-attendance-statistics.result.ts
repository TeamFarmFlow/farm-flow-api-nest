export type GetAttendanceStatisticUser = {
  id: string;
  name: string;
};

export type GetAttendanceStatisticRole = {
  id: string;
  name: string;
  super: boolean;
  required: boolean;
};

export type GetAttendanceStatisticRow = {
  user: GetAttendanceStatisticUser;
  role: GetAttendanceStatisticRole | null;
  seconds: number;
  payRatePerHour: number;
  payDeductionAmount: number;
};

export type GetAttendanceStatisticResult = {
  total: number;
  rows: GetAttendanceStatisticRow[];
};
