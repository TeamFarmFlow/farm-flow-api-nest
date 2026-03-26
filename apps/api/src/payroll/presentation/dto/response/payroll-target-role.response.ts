import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { PayrollTargetRole } from '@apps/api/payroll/domain';

export class PayrollTargetRoleResponse {
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

  public static fromPayrollRole(payrollTargetRole: PayrollTargetRole) {
    const response = new PayrollTargetRoleResponse();

    response.id = payrollTargetRole.id;
    response.name = payrollTargetRole.name;
    response.super = payrollTargetRole.super;
    response.required = payrollTargetRole.required;

    return response;
  }
}
