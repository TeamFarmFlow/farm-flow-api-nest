import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsInt, IsOptional } from 'class-validator';

import { ContextUser } from '@apps/api/context';
import { UpdateMemberPayrollCommand } from '@apps/api/member/application';

export class UpdateMemberPayrollRequest {
  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @IsOptional()
  readonly payRatePerHour?: number;

  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @IsOptional()
  readonly payDeductionAmount?: number;

  toCommand(userId: string, contextUser: ContextUser): UpdateMemberPayrollCommand {
    return {
      farmId: contextUser.farmId,
      userId,
      payRatePerHour: this.payRatePerHour,
      payDeductionAmount: this.payDeductionAmount,
    };
  }
}
