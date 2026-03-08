import { v4 } from 'uuid';

export class AttendanceQrCode {
  id: string;
  farmId: string;
  deviceId: string;

  key() {
    return `attendance:qrcode:${this.id}`;
  }

  expiresIn() {
    return 70;
  }

  public static from(id: string) {
    const attendanceQrCode = new AttendanceQrCode();

    attendanceQrCode.id = id;

    return attendanceQrCode;
  }

  public static of(farmId: string, deviceId: string = '') {
    const attendanceQrCode = new AttendanceQrCode();

    attendanceQrCode.id = v4();
    attendanceQrCode.farmId = farmId;
    attendanceQrCode.deviceId = deviceId;

    return attendanceQrCode;
  }
}
