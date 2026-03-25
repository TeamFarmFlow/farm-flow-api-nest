import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { GetPayrollsResult } from '@apps/api/payroll/application';

import { PayrollResponse } from './payroll.response';

export class PayrollsResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [PayrollResponse] })
  @Type(() => PayrollResponse)
  @Expose()
  rows: PayrollResponse[];

  public static fromResult(result: GetPayrollsResult) {
    const response = new PayrollsResponse();

    response.total = result.total;
    response.rows = result.rows.map((row) => PayrollResponse.fromPayroll(row));

    return response;
  }
}
