import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsDate, IsOptional } from 'class-validator';

import { dayjs } from '@app/core/time';
import { GetAttendancesQuery } from '@app/module/attendance/application';

export class GetAttendancesRequest {
  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @IsOptional()
  readonly startDate: Date = dayjs().subtract(6, 'day').toDate();

  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @IsOptional()
  readonly endDate: Date = dayjs().toDate();

  toQuery(farmId: string, userId: string): GetAttendancesQuery {
    return {
      farmId,
      userId,
      startDate: dayjs(this.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(this.endDate).format('YYYY-MM-DD'),
    };
  }
}
