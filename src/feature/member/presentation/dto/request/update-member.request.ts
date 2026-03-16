import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsInt, IsOptional, IsUUID } from 'class-validator';

import { UpdateMemberCommand } from '@app/feature/member/application';

export class UpdateMemberRequest {
  @ApiPropertyOptional({ type: String })
  @IsUUID(4)
  @IsOptional()
  readonly roleId?: string;

  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @IsOptional()
  readonly payRatePerHour?: number;

  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @IsOptional()
  readonly payDeductionAmount?: number;

  toCommand(farmId: string, userId: string): UpdateMemberCommand {
    return {
      farmId,
      userId,
      roleId: this.roleId,
      payRatePerHour: this.payRatePerHour,
      payDeductionAmount: this.payDeductionAmount,
    };
  }
}
