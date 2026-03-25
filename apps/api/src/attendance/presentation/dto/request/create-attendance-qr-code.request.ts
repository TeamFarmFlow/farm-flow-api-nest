import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { CreateAttendanceQrCodeCommand } from '@apps/api/attendance/application';
import { ContextUser } from '@apps/api/context';

export class CreateAttendanceQrCodeRequest {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  readonly deviceId: string;

  toCommand(contextUser: ContextUser): CreateAttendanceQrCodeCommand {
    return {
      farmId: contextUser.farmId,
      deviceId: this.deviceId,
    };
  }
}
