import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsDate, IsOptional } from 'class-validator';

import { datetime } from '@libs/datetime';

import { GetPayrollsQuery } from '@apps/api/payroll/application';

export class GetPayrollsRequest {
  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @IsOptional()
  readonly startDate: Date = datetime().subtract(6, 'day').toDate();

  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @IsOptional()
  readonly endDate: Date = datetime().toDate();

  toQuery(farmId: string): GetPayrollsQuery {
    return {
      farmId,
      startDate: datetime(this.startDate).format('YYYY-MM-DD'),
      endDate: datetime(this.endDate).format('YYYY-MM-DD'),
    };
  }
}
