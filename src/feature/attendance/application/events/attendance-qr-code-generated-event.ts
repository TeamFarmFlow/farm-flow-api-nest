import { AttendanceQrChallenge } from '@app/infra/persistence/typeorm';

export class AttendanceQrCodeGeneratedEvent {
  id: string;
  deviceId: string;

  public static from(attendanceQrChallenge: AttendanceQrChallenge) {
    const event = new AttendanceQrCodeGeneratedEvent();

    event.id = attendanceQrChallenge.id;
    event.deviceId = attendanceQrChallenge.deviceId;

    return event;
  }
}
