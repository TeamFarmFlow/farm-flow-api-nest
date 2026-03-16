import { Attendance } from '@app/infra/persistence/typeorm';

export type GetAttendancesResult = {
  total: number;
  rows: Attendance[];
};
