import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { ContextUser } from '@apps/api/context';
import { UpdateMyProfileCommand } from '@apps/api/me/application';

export class UpdateMyProfileRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly name: string;

  toCommand(contextUser: ContextUser): UpdateMyProfileCommand {
    return {
      userId: contextUser.userId,
      name: this.name,
    };
  }
}
