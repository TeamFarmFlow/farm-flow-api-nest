import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { PayrollTarget } from '@apps/api/payroll/domain';

import { PayrollTargetRoleResponse } from './payroll-target-role.response';
import { PayrollUserResponse } from './payroll-user.response';

export class PayrollTargetResponse {
  @ApiProperty({ type: PayrollUserResponse })
  @Type(() => PayrollUserResponse)
  @Expose()
  user: PayrollUserResponse;

  @ApiPropertyOptional({ type: PayrollTargetRoleResponse })
  @Type(() => PayrollTargetRoleResponse)
  @Expose()
  role: PayrollTargetRoleResponse | null;

  @ApiProperty({ type: Number })
  @Expose()
  seconds: number;

  @ApiProperty({ type: Number })
  @Expose()
  payRatePerHour: number;

  @ApiProperty({ type: Number })
  @Expose()
  payDeductionAmount: number;

  @ApiProperty({ type: Boolean })
  @Expose()
  needCheck: boolean;

  public static fromPayroll(payrollTarget: PayrollTarget) {
    const response = new PayrollTargetResponse();

    response.user = PayrollUserResponse.fromPayrollUser(payrollTarget.user);
    response.role = payrollTarget.role ? PayrollTargetRoleResponse.fromPayrollRole(payrollTarget.role) : null;
    response.seconds = payrollTarget.seconds;
    response.payRatePerHour = payrollTarget.payRatePerHour;
    response.payDeductionAmount = payrollTarget.payDeductionAmount;
    response.needCheck = payrollTarget.needCheck;

    return response;
  }
}
