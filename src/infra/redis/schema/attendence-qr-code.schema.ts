import { v4 } from 'uuid';

export class AttendanceQrCodeSchema {
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
    const schema = new AttendanceQrCodeSchema();

    schema.id = id;

    return schema;
  }

  public static of(farmId: string, deviceId: string = '') {
    const schema = new AttendanceQrCodeSchema();

    schema.id = v4();
    schema.farmId = farmId;
    schema.deviceId = deviceId;

    return schema;
  }
}
