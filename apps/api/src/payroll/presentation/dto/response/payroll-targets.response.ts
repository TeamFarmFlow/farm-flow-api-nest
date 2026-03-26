import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { GetPayrollTargetsResult } from '@apps/api/payroll/application';

import { PayrollTargetResponse } from './payroll-target.response';

export class PayrollTargetsResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [PayrollTargetResponse] })
  @Type(() => PayrollTargetResponse)
  @Expose()
  rows: PayrollTargetResponse[];

  public static fromResult(result: GetPayrollTargetsResult) {
    const response = new PayrollTargetsResponse();

    response.total = result.total;
    response.rows = result.rows.map((row) => PayrollTargetResponse.fromPayroll(row));

    return response;
  }
}
