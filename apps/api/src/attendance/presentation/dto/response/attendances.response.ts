import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { GetAttendancesResult } from '@apps/api/attendance/application';

import { AttendanceResponse } from './attendance.response';

export class AttendancesResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [AttendanceResponse] })
  @Type(() => AttendanceResponse)
  @Expose()
  rows: AttendanceResponse[];

  public static fromResult(result: GetAttendancesResult) {
    const response = new AttendancesResponse();

    response.total = result.total;
    response.rows = result.rows.map((row) => AttendanceResponse.fromAttendance(row));

    return response;
  }
}
