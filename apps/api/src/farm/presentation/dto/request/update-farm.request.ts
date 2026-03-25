import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsInt, IsOptional, Length } from 'class-validator';

import { ContextUser } from '@apps/api/context';
import { UpdateFarmCommand } from '@apps/api/farm/application';

export class UpdateFarmRequest {
  @ApiPropertyOptional({ type: String })
  @Length(1, 50)
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @IsOptional()
  readonly payRatePerHour?: number;

  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @IsOptional()
  readonly payDeductionAmount?: number;

  toCommand(farmId: string, contextUser: ContextUser): UpdateFarmCommand {
    return {
      farmId,
      userId: contextUser.userId,
      name: this.name,
      payRatePerHour: this.payRatePerHour,
      payDeductionAmount: this.payDeductionAmount,
    };
  }
}
