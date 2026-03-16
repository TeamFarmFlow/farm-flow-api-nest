import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { AttendanceRoleResponse } from './attendance-role.response';
import { AttendanceUserResponse } from './attendance-user.response';

export class AttendanceStatisticResponse {
  @ApiProperty({ type: AttendanceUserResponse })
  @Type(() => AttendanceUserResponse)
  @Expose()
  user: AttendanceUserResponse;

  @ApiPropertyOptional({ type: AttendanceRoleResponse })
  @Type(() => AttendanceRoleResponse)
  @Expose()
  role: AttendanceRoleResponse | null;

  @ApiProperty({ type: Number })
  @Expose()
  seconds: number;

  @ApiProperty({ type: Number })
  @Expose()
  payRatePerHour: number;

  @ApiProperty({ type: Number })
  @Expose()
  payDeductionAmount: number;
}
