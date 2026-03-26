import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { GetPayrollTargetsByUserIdResult } from '@apps/api/payroll/application';

import { PayrollTargetByUserIdResponse } from './payroll-target-by-user-id.response';

export class PayrollTargetsByUserIdResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: Number })
  @Expose()
  payRatePerHour: number;

  @ApiProperty({ type: Number })
  @Expose()
  payDeductionAmount: number;

  @ApiProperty({ type: [PayrollTargetByUserIdResponse] })
  @Type(() => PayrollTargetByUserIdResponse)
  @Expose()
  rows: PayrollTargetByUserIdResponse[];

  public static fromResult(result: GetPayrollTargetsByUserIdResult) {
    const response = new PayrollTargetsByUserIdResponse();

    response.total = result.total;
    response.payRatePerHour = result.payRatePerHour;
    response.payDeductionAmount = result.payDeductionAmount;
    response.rows = result.rows.map((row) => PayrollTargetByUserIdResponse.fromPayrollAttendance(row));

    return response;
  }
}
