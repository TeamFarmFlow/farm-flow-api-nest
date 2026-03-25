import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { PayrollUser } from '@apps/api/payroll/domain';

export class PayrollUserResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  public static fromPayrollUser(payrollUser: PayrollUser) {
    const response = new PayrollUserResponse();

    response.id = payrollUser.id;
    response.name = payrollUser.name;

    return response;
  }
}
