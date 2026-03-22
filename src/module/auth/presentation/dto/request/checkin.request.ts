import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsUUID } from 'class-validator';

import { CheckInCommand } from '@app/module/auth/application';

export class CheckInRequest {
  @ApiProperty({ type: String })
  @IsUUID(4)
  @IsNotEmpty()
  readonly farmId: string;

  toCommand(userId: string, refreshTokenId: string): CheckInCommand {
    return {
      farmId: this.farmId,
      refreshTokenId,
      userId,
    };
  }
}
