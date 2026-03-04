import { Injectable } from '@nestjs/common';

import { AttendanceQrChallenge, AttendanceQrChallengeRepository } from '@app/infra/persistence/typeorm';

import { CreateAttendanceQrCodeCommand } from './commands';
import { CreateAttendanceQrCodeResult } from './results';

@Injectable()
export class AttendanceQrChallengeService {
  constructor(private readonly attendanceQrChallengeRepository: AttendanceQrChallengeRepository) {}

  async createQrCode(command: CreateAttendanceQrCodeCommand): Promise<CreateAttendanceQrCodeResult> {
    const attendanceQrChallenge = AttendanceQrChallenge.of(command.farmId);
    await this.attendanceQrChallengeRepository.insert(attendanceQrChallenge);

    return { id: attendanceQrChallenge.id };
  }
}
