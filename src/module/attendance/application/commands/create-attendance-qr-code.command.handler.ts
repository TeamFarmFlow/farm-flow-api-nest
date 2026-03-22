import { Inject, Injectable } from '@nestjs/common';

import { ATTENDANCE_QR_CODE_STORE, AttendanceQrCodeStorePort } from '../ports';
import { CreateAttendanceQrCodeResult } from '../results';

import { CreateAttendanceQrCodeCommand } from './create-attendance-qr-code.command';

@Injectable()
export class CreateAttendanceQrCodeCommandHandler {
  constructor(
    @Inject(ATTENDANCE_QR_CODE_STORE)
    private readonly attendanceQrCodeStore: AttendanceQrCodeStorePort,
  ) {}

  async execute(command: CreateAttendanceQrCodeCommand): Promise<CreateAttendanceQrCodeResult> {
    const attendanceQrCode = await this.attendanceQrCodeStore.issue(command.farmId, command.deviceId);

    return { id: attendanceQrCode.id };
  }
}
