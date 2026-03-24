import { Inject, Injectable } from '@nestjs/common';

import { InvalidQrCodeException } from '../../domain';
import {
  ATTENDANCE_FARM_USER_REPOSITORY,
  ATTENDANCE_QR_CODE_STORE,
  ATTENDANCE_REPOSITORY,
  AttendanceFarmUserRepositoryPort,
  AttendanceQrCodeStorePort,
  AttendanceRepositoryPort,
} from '../ports';

import { CheckOutAttendanceCommand } from './check-out-attendance.command';

@Injectable()
export class CheckOutAttendanceCommandHandler {
  constructor(
    @Inject(ATTENDANCE_FARM_USER_REPOSITORY)
    private readonly farmUserRepository: AttendanceFarmUserRepositoryPort,
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: AttendanceRepositoryPort,
    @Inject(ATTENDANCE_QR_CODE_STORE)
    private readonly attendanceQrCodeStore: AttendanceQrCodeStorePort,
  ) {}

  async execute(command: CheckOutAttendanceCommand) {
    const workDate = await this.farmUserRepository.getCurrentWorkDateOrFail(command.farmId, command.userId);
    const attendanceQrCode = await this.attendanceQrCodeStore.consume(command.qrCode);

    if (!attendanceQrCode) {
      throw new InvalidQrCodeException();
    }

    await this.attendanceQrCodeStore.issue(command.farmId, attendanceQrCode.deviceId);
    await this.attendanceRepository.updateToCheckOutByWorkDate(command.farmId, command.userId, workDate);

    return this.attendanceRepository.findByWorkDateOrFail(command.farmId, command.userId, workDate);
  }
}
