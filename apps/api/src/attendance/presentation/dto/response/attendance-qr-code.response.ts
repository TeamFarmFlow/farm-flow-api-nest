import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { AttendanceQrCodeGeneratedEvent } from '@apps/api/attendance/domain';

export class AttendanceQrCodeResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  public static fromEvent(event: AttendanceQrCodeGeneratedEvent) {
    const response = new AttendanceQrCodeResponse();

    response.id = event.id;

    return response;
  }
}
