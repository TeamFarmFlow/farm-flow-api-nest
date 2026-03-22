import { Injectable } from '@nestjs/common';

import { RedisClient, RedisPublisher } from '@app/infra/redis';

import { AttendanceQrCode, AttendanceQrCodeGeneratedEvent } from '../domain';

import { CreateAttendanceQrCodeCommand } from './commands';
import { CreateAttendanceQrCodeResult } from './results';

@Injectable()
export class AttendanceQrCodeService {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly redisPublisher: RedisPublisher,
  ) {}

  async createQrCode(command: CreateAttendanceQrCodeCommand): Promise<CreateAttendanceQrCodeResult> {
    const attendanceQrCode = AttendanceQrCode.of(command.farmId, command.deviceId);

    await this.redisClient.setJSON(attendanceQrCode.key(), attendanceQrCode);
    await this.redisClient.expire(attendanceQrCode.key(), attendanceQrCode.expiresIn());
    await this.redisPublisher.publishJSON('attendance.qr.generated', AttendanceQrCodeGeneratedEvent.from(attendanceQrCode));

    return { id: attendanceQrCode.id };
  }
}
