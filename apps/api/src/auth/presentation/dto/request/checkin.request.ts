import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsUUID } from 'class-validator';

import { CheckInCommand } from '@apps/api/auth/application';
import { ContextUser } from '@apps/api/context';

export class CheckInRequest {
  @ApiProperty({ type: String })
  @IsUUID(4)
  @IsNotEmpty()
  readonly farmId: string;

  toCommand(contextUser: ContextUser, refreshTokenId: string): CheckInCommand {
    return {
      farmId: this.farmId,
      refreshTokenId,
      userId: contextUser.userId,
    };
  }
}
