import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class ValidateInvitationCodeResponse {
  @ApiProperty({ type: String })
  @Expose()
  farmId: string;
}
