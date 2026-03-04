import { Injectable } from '@nestjs/common';

import { AttendanceQrChallenge, AttendanceQrChallengeRepository } from '@app/infra/persistence/typeorm';

import { CreateAttendanceQrCodeResult } from './results';

@Injectable()
export class AttendanceQrChallengeService {
  constructor(private readonly attendanceQrChallengeRepository: AttendanceQrChallengeRepository) {}

  async createQrCode(farmId: string): Promise<CreateAttendanceQrCodeResult> {
    const attendanceQrChallenge = AttendanceQrChallenge.of(farmId);
    await this.attendanceQrChallengeRepository.insert(attendanceQrChallenge);

    return { id: attendanceQrChallenge.id };
  }
}
