import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { ContextUser } from '@apps/api/context';
import { ValidateInvitationCodeCommand } from '@apps/api/invitation/application';

export class ValidateInvitationCodeRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly code: string;

  toCommand(contextUser: ContextUser): ValidateInvitationCodeCommand {
    return {
      userId: contextUser.userId,
      code: this.code,
    };
  }
}
