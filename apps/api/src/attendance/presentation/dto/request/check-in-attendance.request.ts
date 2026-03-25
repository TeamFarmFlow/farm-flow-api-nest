import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { CheckInAttendanceCommand } from '@apps/api/attendance/application';
import { ContextUser } from '@apps/api/context';

export class CheckInAttendanceRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly qrCode: string;

  toCommand(contextUser: ContextUser): CheckInAttendanceCommand {
    return {
      qrCode: this.qrCode,
      farmId: contextUser.farmId,
      userId: contextUser.userId,
    };
  }
}
