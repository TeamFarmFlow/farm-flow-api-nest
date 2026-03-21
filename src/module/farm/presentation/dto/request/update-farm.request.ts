import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsInt, IsOptional, Length } from 'class-validator';

import { UpdateFarmCommand } from '@app/module/farm/application';

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

  toCommand(farmId: string, userId: string): UpdateFarmCommand {
    return {
      farmId,
      userId,
      name: this.name,
      payRatePerHour: this.payRatePerHour,
      payDeductionAmount: this.payDeductionAmount,
    };
  }
}
