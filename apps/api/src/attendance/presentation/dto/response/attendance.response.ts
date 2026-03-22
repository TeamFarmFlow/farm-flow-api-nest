import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { AttendanceStatus } from '@libs/shared';

export class AttendanceResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String, format: 'date' })
  @Expose()
  workDate: string;

  @ApiProperty({ enum: AttendanceStatus })
  @Expose()
  status: AttendanceStatus;

  @ApiProperty({ type: Date })
  @Expose()
  checkedInAt: Date | null;

  @ApiProperty({ type: Date })
  @Expose()
  checkedOutAt: Date | null;

  @ApiProperty({ type: Number })
  @Expose()
  seconds: number;
}
