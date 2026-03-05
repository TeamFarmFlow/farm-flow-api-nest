import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class AttendanceQrCodeResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;
}
