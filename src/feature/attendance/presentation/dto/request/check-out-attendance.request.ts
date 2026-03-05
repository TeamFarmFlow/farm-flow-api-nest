import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { CheckOutAttendanceCommand } from '@app/feature/attendance/application';

export class CheckOutAttendanceRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly qrCode: string;

  toCommand(farmId: string, userId: string): CheckOutAttendanceCommand {
    return {
      qrCode: this.qrCode,
      farmId,
      userId,
    };
  }
}
