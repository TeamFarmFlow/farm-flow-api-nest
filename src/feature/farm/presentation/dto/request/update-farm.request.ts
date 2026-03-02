import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, Length } from 'class-validator';

import { UpdateFarmCommand } from '@app/feature/farm/application';

export class UpdateFarmRequest {
  @ApiPropertyOptional({ type: String })
  @Length(1, 50)
  @IsOptional()
  readonly name?: string;

  toCommand(farmId: string, userId: string): UpdateFarmCommand {
    return {
      farmId,
      userId,
      name: this.name,
    };
  }
}
