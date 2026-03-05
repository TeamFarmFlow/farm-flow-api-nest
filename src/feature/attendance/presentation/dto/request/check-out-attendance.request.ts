import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { CheckOutAttendanceCommand } from '@app/feature/attendance/application';

export class CheckOutAttendanceRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly crCode: string;

  toCommand(farmId: string, userId: string): CheckOutAttendanceCommand {
    return {
      crCode: this.crCode,
      farmId,
      userId,
    };
  }
}
