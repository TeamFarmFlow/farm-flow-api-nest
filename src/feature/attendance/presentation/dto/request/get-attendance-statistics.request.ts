import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsDate, IsOptional } from 'class-validator';

import { dayjs } from '@app/core/time';
import { GetAttendanceStatisticsQuery } from '@app/feature/attendance/application';

export class GetAttendanceStatisticsRequest {
  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @IsOptional()
  readonly startDate: Date = dayjs().subtract(6, 'day').toDate();

  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @IsOptional()
  readonly endDate: Date = dayjs().toDate();

  toQuery(farmId: string): GetAttendanceStatisticsQuery {
    return {
      farmId,
      startDate: dayjs(this.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(this.endDate).format('YYYY-MM-DD'),
    };
  }
}
