import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { PayrollByUserIdResponse } from './payroll-by-user-id.response';

export class PayrollsByUserIdResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: Number })
  @Expose()
  payRatePerHour: number;

  @ApiProperty({ type: Number })
  @Expose()
  payDeductionAmount: number;

  @ApiProperty({ type: [PayrollByUserIdResponse] })
  @Type(() => PayrollByUserIdResponse)
  @Expose()
  rows: PayrollByUserIdResponse[];
}
