import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { PayrollResponse } from './payroll.response';

export class PayrollsResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [PayrollResponse] })
  @Type(() => PayrollResponse)
  @Expose()
  rows: PayrollResponse[];
}
