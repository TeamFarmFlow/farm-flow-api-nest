import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsDate, IsOptional } from 'class-validator';

import { datetime } from '@libs/datetime';

import { GetAttendancesQuery } from '@apps/api/attendance/application';

export class GetAttendancesRequest {
  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @IsOptional()
  readonly startDate: Date = datetime().subtract(6, 'day').toDate();

  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @IsOptional()
  readonly endDate: Date = datetime().toDate();

  toQuery(farmId: string, userId: string): GetAttendancesQuery {
    return {
      farmId,
      userId,
      startDate: datetime(this.startDate).format('YYYY-MM-DD'),
      endDate: datetime(this.endDate).format('YYYY-MM-DD'),
    };
  }
}
