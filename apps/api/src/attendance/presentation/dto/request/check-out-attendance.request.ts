import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { CheckOutAttendanceCommand } from '@apps/api/attendance/application';
import { ContextUser } from '@apps/api/context';

export class CheckOutAttendanceRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly qrCode: string;

  toCommand(contextUser: ContextUser): CheckOutAttendanceCommand {
    return {
      qrCode: this.qrCode,
      farmId: contextUser.farmId,
      userId: contextUser.userId,
    };
  }
}
