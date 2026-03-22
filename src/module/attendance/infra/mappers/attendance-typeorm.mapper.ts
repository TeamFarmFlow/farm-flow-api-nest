import { AttendanceEntity } from '@app/infra/persistence/typeorm';

import { Attendance } from '../../domain';

export class AttendanceTypeOrmMapper {
  static toAttendance(attendance: AttendanceEntity): Attendance {
    const mappedAttendance = new Attendance();

    mappedAttendance.id = attendance.id;
    mappedAttendance.workDate = attendance.workDate;
    mappedAttendance.status = attendance.status;
    mappedAttendance.checkedInAt = attendance.checkedInAt;
    mappedAttendance.checkedOutAt = attendance.checkedOutAt;
    mappedAttendance.seconds = attendance.seconds;

    return mappedAttendance;
  }
}
