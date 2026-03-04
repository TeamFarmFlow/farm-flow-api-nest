import { CreateAttendanceQrCodeCommand } from '@app/feature/attendance/application';

export class CreateAttendanceQrCodeRequest {
  toCommand(farmId: string): CreateAttendanceQrCodeCommand {
    return {
      farmId,
    };
  }
}
