import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { CheckInAttendanceCommand } from '@app/feature/attendance/application';

export class CheckInAttendanceRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly crCode: string;

  toCommand(farmId: string, userId: string): CheckInAttendanceCommand {
    return {
      crCode: this.crCode,
      farmId,
      userId,
    };
  }
}
