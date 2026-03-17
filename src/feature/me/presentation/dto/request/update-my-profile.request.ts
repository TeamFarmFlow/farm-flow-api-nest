import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { UpdateMyProfileCommand } from '@app/feature/me/application';

export class UpdateMyProfileRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly name: string;

  toCommand(userId: string): UpdateMyProfileCommand {
    return {
      userId,
      name: this.name,
    };
  }
}
