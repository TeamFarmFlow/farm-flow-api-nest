import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { PayrollRole } from '@apps/api/payroll/domain';

export class PayrollRoleResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  super: boolean;

  @ApiProperty({ type: Boolean })
  @Expose()
  required: boolean;

  public static fromPayrollRole(payrollRole: PayrollRole) {
    const response = new PayrollRoleResponse();

    response.id = payrollRole.id;
    response.name = payrollRole.name;
    response.super = payrollRole.super;
    response.required = payrollRole.required;

    return response;
  }
}
