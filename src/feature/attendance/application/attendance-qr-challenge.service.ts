import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { AttendanceQrChallenge, AttendanceQrChallengeRepository } from '@app/infra/persistence/typeorm';

import { CreateAttendanceQrCodeCommand } from './commands';
import { AttendanceQrCodeGeneratedEvent } from './events';
import { CreateAttendanceQrCodeResult } from './results';

@Injectable()
export class AttendanceQrChallengeService {
  constructor(
    private readonly eventeEmitter: EventEmitter2,
    private readonly attendanceQrChallengeRepository: AttendanceQrChallengeRepository,
  ) {}

  async createQrCode(command: CreateAttendanceQrCodeCommand): Promise<CreateAttendanceQrCodeResult> {
    const attendanceQrChallenge = AttendanceQrChallenge.of(command.farmId, command.deviceId);
    await this.attendanceQrChallengeRepository.insert(attendanceQrChallenge);
    await this.eventeEmitter.emitAsync('attendance.qr.generated', AttendanceQrCodeGeneratedEvent.from(attendanceQrChallenge));

    return { id: attendanceQrChallenge.id };
  }
}
