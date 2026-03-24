import { AttendanceStatus } from '@libs/shared';

export class Attendance {
  id: string;
  workDate: string;
  status: AttendanceStatus;
  checkedInAt: Date | null;
  checkedOutAt: Date | null;
  seconds: number;
}
