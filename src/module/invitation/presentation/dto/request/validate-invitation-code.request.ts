import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { ValidateInvitationCodeCommand } from '@app/module/invitation/application';

export class ValidateInvitationCodeRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly code: string;

  toCommand(userId: string): ValidateInvitationCodeCommand {
    return {
      userId,
      code: this.code,
    };
  }
}
