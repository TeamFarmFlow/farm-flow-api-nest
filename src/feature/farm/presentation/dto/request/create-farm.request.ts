import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, Length } from 'class-validator';

import { CreateFarmCommand } from '@app/feature/farm/application';

export class CreateFarmRequest {
  @ApiProperty({ type: String })
  @Length(1, 50)
  @IsNotEmpty()
  readonly name: string;

  toCommand(userId: string): CreateFarmCommand {
    return {
      userId,
      name: this.name,
    };
  }
}
