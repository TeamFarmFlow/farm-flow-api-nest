import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { GetPayrollsByUserIdResult } from '@apps/api/payroll/application';

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

  public static fromResult(result: GetPayrollsByUserIdResult) {
    const response = new PayrollsByUserIdResponse();

    response.total = result.total;
    response.payRatePerHour = result.payRatePerHour;
    response.payDeductionAmount = result.payDeductionAmount;
    response.rows = result.rows.map((row) => PayrollByUserIdResponse.fromPayrollAttendance(row));

    return response;
  }
}
