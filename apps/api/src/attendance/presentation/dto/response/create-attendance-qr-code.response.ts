import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { CreateAttendanceQrCodeResult } from '@apps/api/attendance/application';

export class CreateAttendanceQrCodeResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  public static fromResult(result: CreateAttendanceQrCodeResult) {
    const response = new CreateAttendanceQrCodeResponse();

    response.id = result.id;

    return response;
  }
}
