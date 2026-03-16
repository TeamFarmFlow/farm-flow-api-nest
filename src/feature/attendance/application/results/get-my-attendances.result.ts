import { Attendance } from '@app/infra/persistence/typeorm';

export type GetMyAttendancesResult = {
  total: number;
  rows: Attendance[];
};
