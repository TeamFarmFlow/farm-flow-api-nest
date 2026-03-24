import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class CreateAttendanceQrCodeResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;
}
