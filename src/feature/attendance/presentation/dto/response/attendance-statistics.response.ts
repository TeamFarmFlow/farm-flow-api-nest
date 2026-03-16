import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { AttendanceStatisticResponse } from './attendance-statistic.response';

export class AttendanceStatisticsResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [AttendanceStatisticResponse] })
  @Type(() => AttendanceStatisticResponse)
  @Expose()
  rows: AttendanceStatisticResponse[];
}
