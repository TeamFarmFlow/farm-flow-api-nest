import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { CreateAttendanceQrCodeCommand } from '@app/feature/attendance/application';

export class CreateAttendanceQrCodeRequest {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  readonly deviceId: string;

  toCommand(farmId: string): CreateAttendanceQrCodeCommand {
    return {
      farmId,
      deviceId: this.deviceId,
    };
  }
}
