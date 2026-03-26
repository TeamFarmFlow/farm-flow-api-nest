import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsNotEmpty } from 'class-validator';

import { ContextUser } from '@apps/api/context';
import { UpdatePayrollAttendanceCommand } from '@apps/api/payroll/application';

export class UpdatePayrollAttendanceRequest {
  @ApiProperty({ type: Date })
  @IsDate()
  @IsNotEmpty()
  readonly checkedInAt: Date;

  @ApiProperty({ type: Date })
  @IsDate()
  @IsNotEmpty()
  readonly checkedOutAt: Date;

  toCommand(id: string, userId: string, contextUser: ContextUser): UpdatePayrollAttendanceCommand {
    return {
      id,
      farmId: contextUser.farmId,
      userId,
      checkedInAt: this.checkedInAt,
      checkedOutAt: this.checkedOutAt,
    };
  }
}
