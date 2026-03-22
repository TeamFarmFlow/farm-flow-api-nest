import { Attendance } from '../../domain';

export type GetAttendancesResult = {
  total: number;
  rows: Attendance[];
};
