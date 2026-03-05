import { Injectable } from '@nestjs/common';

import { AttendanceQrChallenge, AttendanceQrChallengeRepository } from '@app/infra/persistence/typeorm';
import { RedisPublisher } from '@app/infra/redis';

import { CreateAttendanceQrCodeCommand } from './commands';
import { AttendanceQrCodeGeneratedEvent } from './events';
import { CreateAttendanceQrCodeResult } from './results';

@Injectable()
export class AttendanceQrChallengeService {
  constructor(
    private readonly redisPublisher: RedisPublisher,
    private readonly attendanceQrChallengeRepository: AttendanceQrChallengeRepository,
  ) {}

  async createQrCode(command: CreateAttendanceQrCodeCommand): Promise<CreateAttendanceQrCodeResult> {
    const attendanceQrChallenge = AttendanceQrChallenge.of(command.farmId, command.deviceId);
    await this.attendanceQrChallengeRepository.insert(attendanceQrChallenge);
    await this.redisPublisher.publishJSON('attendance.qr.generated', AttendanceQrCodeGeneratedEvent.from(attendanceQrChallenge));

    return { id: attendanceQrChallenge.id };
  }
}
