import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { ValidateInvitationCodeResult } from '@apps/api/invitation/application';

export class ValidateInvitationCodeResponse {
  @ApiProperty({ type: String })
  @Expose()
  farmId: string;

  public static fromResult(result: ValidateInvitationCodeResult) {
    const response = new ValidateInvitationCodeResponse();

    response.farmId = result.farmId;

    return response;
  }
}
