import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { AttendanceStatus } from '@libs/shared';

import { PayrollAttendance } from '@apps/api/payroll/domain';

export class PayrollByUserIdResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  workDate: string;

  @ApiProperty({ enum: AttendanceStatus })
  @Expose()
  status: AttendanceStatus;

  @ApiProperty({ type: Number })
  @Expose()
  seconds: number;

  @ApiProperty({ type: Date })
  @Expose()
  checkedInAt: Date;

  @ApiPropertyOptional({ type: Date })
  @Expose()
  checkedOutAt: Date | null;

  public static fromPayrollAttendance(payrollAttendance: PayrollAttendance) {
    const response = new PayrollByUserIdResponse();

    response.id = payrollAttendance.id;
    response.workDate = payrollAttendance.workDate;
    response.status = payrollAttendance.status;
    response.seconds = payrollAttendance.seconds;
    response.checkedInAt = payrollAttendance.checkedInAt;
    response.checkedOutAt = payrollAttendance.checkedOutAt;

    return response;
  }
}
