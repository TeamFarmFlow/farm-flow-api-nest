import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { AttendanceStatus } from '@libs/shared';

import { Attendance } from '@apps/api/attendance/domain';

export class AttendanceResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String, format: 'date' })
  @Expose()
  workDate: string;

  @ApiProperty({ enum: AttendanceStatus })
  @Expose()
  status: AttendanceStatus;

  @ApiProperty({ type: Date })
  @Expose()
  checkedInAt: Date | null;

  @ApiProperty({ type: Date })
  @Expose()
  checkedOutAt: Date | null;

  @ApiProperty({ type: Number })
  @Expose()
  seconds: number;

  public static fromAttendance(attendance: Attendance) {
    const response = new AttendanceResponse();

    response.id = attendance.id;
    response.workDate = attendance.workDate;
    response.status = attendance.status;
    response.checkedInAt = attendance.checkedInAt;
    response.checkedOutAt = attendance.checkedOutAt;
    response.seconds = attendance.seconds;

    return response;
  }
}
