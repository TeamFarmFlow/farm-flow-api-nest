import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { AttendanceResponse } from './attendance.response';

export class AttendancesResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [AttendanceResponse] })
  @Type(() => AttendanceResponse)
  @Expose()
  rows: AttendanceResponse[];
}
