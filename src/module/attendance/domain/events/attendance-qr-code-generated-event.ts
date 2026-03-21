import { AttendanceQrCode } from '..';

export class AttendanceQrCodeGeneratedEvent {
  id: string;
  deviceId: string;

  public static from(attendanceQrCode: AttendanceQrCode) {
    const event = new AttendanceQrCodeGeneratedEvent();

    event.id = attendanceQrCode.id;
    event.deviceId = attendanceQrCode.deviceId;

    return event;
  }
}
