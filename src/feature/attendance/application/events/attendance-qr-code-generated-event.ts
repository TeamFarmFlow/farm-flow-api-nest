import { AttendanceQrCodeSchema } from '@app/infra/redis';

export class AttendanceQrCodeGeneratedEvent {
  id: string;
  deviceId: string;

  public static from(attendanceQrCode: AttendanceQrCodeSchema) {
    const event = new AttendanceQrCodeGeneratedEvent();

    event.id = attendanceQrCode.id;
    event.deviceId = attendanceQrCode.deviceId;

    return event;
  }
}
