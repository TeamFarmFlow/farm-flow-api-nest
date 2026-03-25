import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { Payroll } from '@apps/api/payroll/domain';

import { PayrollRoleResponse } from './payroll-role.response';
import { PayrollUserResponse } from './payroll-user.response';

export class PayrollResponse {
  @ApiProperty({ type: PayrollUserResponse })
  @Type(() => PayrollUserResponse)
  @Expose()
  user: PayrollUserResponse;

  @ApiPropertyOptional({ type: PayrollRoleResponse })
  @Type(() => PayrollRoleResponse)
  @Expose()
  role: PayrollRoleResponse | null;

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

  public static fromPayroll(payroll: Payroll) {
    const response = new PayrollResponse();

    response.user = PayrollUserResponse.fromPayrollUser(payroll.user);
    response.role = payroll.role ? PayrollRoleResponse.fromPayrollRole(payroll.role) : null;
    response.seconds = payroll.seconds;
    response.payRatePerHour = payroll.payRatePerHour;
    response.payDeductionAmount = payroll.payDeductionAmount;
    response.needCheck = payroll.needCheck;

    return response;
  }
}
