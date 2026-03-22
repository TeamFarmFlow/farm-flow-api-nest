import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { AttendanceStatus } from '@libs/shared';

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
}
