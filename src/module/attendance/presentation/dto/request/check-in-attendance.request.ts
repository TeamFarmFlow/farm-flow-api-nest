import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { CheckInAttendanceCommand } from '@app/module/attendance/application';

export class CheckInAttendanceRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly qrCode: string;

  toCommand(farmId: string, userId: string): CheckInAttendanceCommand {
    return {
      qrCode: this.qrCode,
      farmId,
      userId,
    };
  }
}
