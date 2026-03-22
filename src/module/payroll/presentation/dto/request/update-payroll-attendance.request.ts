import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsNotEmpty } from 'class-validator';

import { UpdatePayrollAttendanceCommand } from '@app/module/payroll/application';

export class UpdatePayrollAttendanceRequest {
  @ApiProperty({ type: Date })
  @IsDate()
  @IsNotEmpty()
  readonly checkedInAt: Date;

  @ApiProperty({ type: Date })
  @IsDate()
  @IsNotEmpty()
  readonly checkedOutAt: Date;

  toCommand(id: string, userId: string, farmId: string): UpdatePayrollAttendanceCommand {
    return {
      id,
      farmId,
      userId,
      checkedInAt: this.checkedInAt,
      checkedOutAt: this.checkedOutAt,
    };
  }
}
