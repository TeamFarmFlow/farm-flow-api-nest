import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { RedisClient, RedisPublisher } from '@app/infra/redis';

import { AttendanceQrCodeStorePort } from '../../application';
import { AttendanceQrCode, AttendanceQrCodeGeneratedEvent } from '../../domain';

@Injectable()
export class AttendanceQrCodeStore implements AttendanceQrCodeStorePort {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly redisPublisher: RedisPublisher,
  ) {}

  async issue(farmId: string, deviceId: string): Promise<AttendanceQrCode> {
    const attendanceQrCode = AttendanceQrCode.of(farmId, deviceId);

    await this.redisClient.setJSON(attendanceQrCode.key(), attendanceQrCode);
    await this.redisClient.expire(attendanceQrCode.key(), attendanceQrCode.expiresIn());
    await this.redisPublisher.publishJSON('attendance.qr.generated', AttendanceQrCodeGeneratedEvent.from(attendanceQrCode));

    return attendanceQrCode;
  }

  async consume(attendanceQrCodeId: string): Promise<AttendanceQrCode | null> {
    const attendanceQrCodeKey = AttendanceQrCode.from(attendanceQrCodeId).key();
    const attendanceQrCode = plainToInstance(AttendanceQrCode, await this.redisClient.getJSON(attendanceQrCodeKey));

    await this.redisClient.del(attendanceQrCodeKey);

    return attendanceQrCode;
  }

  async revoke(attendanceQrCodeId: string): Promise<void> {
    await this.redisClient.del(AttendanceQrCode.from(attendanceQrCodeId).key());
  }
}
