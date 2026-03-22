import { AttendanceStatus } from '@app/shared/domain';

export class PayrollAttendance {
  id: string;
  workDate: string;
  seconds: number;
  status: AttendanceStatus;
  checkedInAt: Date;
  checkedOutAt: Date | null;
}
