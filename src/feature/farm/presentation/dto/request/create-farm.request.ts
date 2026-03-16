import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsNotEmpty, Length } from 'class-validator';

import { CreateFarmCommand } from '@app/feature/farm/application';

export class CreateFarmRequest {
  @ApiProperty({ type: String })
  @Length(1, 50)
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsNotEmpty()
  readonly payRatePerHour: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsNotEmpty()
  readonly payDeductionAmount: number;

  toCommand(userId: string): CreateFarmCommand {
    return {
      userId,
      name: this.name,
      payRatePerHour: this.payRatePerHour,
      payDeductionAmount: this.payDeductionAmount,
    };
  }
}
