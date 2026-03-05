import { Injectable } from '@nestjs/common';

import { toInstance } from '@app/core/transform';
import { Attendance, AttendanceRepository, FarmUserRepository } from '@app/infra/persistence/typeorm';
import { AttendanceQrCodeSchema, RedisClient, RedisPublisher } from '@app/infra/redis';

import { CheckInAttendanceCommand, CheckOutAttendanceCommand } from './commands';
import { AttendanceQrCodeGeneratedEvent } from './events';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly redisPublisher: RedisPublisher,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async getAttendanceByToday(farmId: string, userId: string): Promise<Attendance | null> {
    const farmUser = await this.farmUserRepository.findWithFarm(farmId, userId);

    if (!farmUser) {
      throw new Error('forbidden');
    }

    return this.attendanceRepository.findByWorkDate(farmId, userId, farmUser.farm.dateOfTimeZone);
  }

  async checkInAttendnace(command: CheckInAttendanceCommand): Promise<void> {
    const farmUser = await this.farmUserRepository.findWithFarm(command.farmId, command.userId);

    if (!farmUser) {
      throw new Error('forbidden');
    }

    const attendanceQrCodeKey = AttendanceQrCodeSchema.of(command.farmId).key();
    const attendanceQrCode = toInstance(AttendanceQrCodeSchema, await this.redisClient.getJSON(attendanceQrCodeKey));
    await this.redisClient.del(attendanceQrCodeKey);

    if (!attendanceQrCode) {
      throw new Error('invalid qr code');
    }

    const newAttendanceQrCode = AttendanceQrCodeSchema.of(command.farmId, attendanceQrCode.deviceId);
    await this.redisClient.setJSON(newAttendanceQrCode.key(), newAttendanceQrCode);
    await this.redisClient.expire(newAttendanceQrCode.key(), newAttendanceQrCode.expiresIn());
    await this.redisPublisher.publishJSON('attendance.qr.generated', AttendanceQrCodeGeneratedEvent.from(newAttendanceQrCode));
    await this.attendanceRepository.upsertOrIgnore(Attendance.of(farmUser.farm, farmUser.userId));
  }

  async checkOutAttendnace(command: CheckOutAttendanceCommand): Promise<void> {
    const farmUser = await this.farmUserRepository.findWithFarm(command.farmId, command.userId);

    if (!farmUser) {
      throw new Error('forbidden');
    }

    const attendanceQrCodeKey = AttendanceQrCodeSchema.of(command.farmId).key();
    const attendanceQrCode = toInstance(AttendanceQrCodeSchema, await this.redisClient.getJSON(attendanceQrCodeKey));
    await this.redisClient.del(attendanceQrCodeKey);

    if (!attendanceQrCode) {
      throw new Error('invalid qr code');
    }

    const newAttendanceQrCode = AttendanceQrCodeSchema.of(command.farmId, attendanceQrCode.deviceId);
    await this.redisClient.setJSON(newAttendanceQrCode.key(), newAttendanceQrCode);
    await this.redisClient.expire(newAttendanceQrCode.key(), newAttendanceQrCode.expiresIn());
    await this.redisPublisher.publishJSON('attendance.qr.generated', AttendanceQrCodeGeneratedEvent.from(newAttendanceQrCode));
    await this.attendanceRepository.updateToCheckOutByWorkDate(farmUser.farmId, farmUser.userId, farmUser.farm.dateOfTimeZone);
  }
}
