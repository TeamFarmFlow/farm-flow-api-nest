import { AttendanceQrCode } from '../../domain';

export interface AttendanceQrCodeStorePort {
  issue(farmId: string, deviceId: string): Promise<AttendanceQrCode>;
  consume(attendanceQrCodeId: string): Promise<AttendanceQrCode | null>;
  revoke(attendanceQrCodeId: string): Promise<void>;
}
