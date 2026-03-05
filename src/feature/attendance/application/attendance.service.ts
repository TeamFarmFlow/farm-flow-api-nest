import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { Attendance, AttendanceQrChallenge, AttendanceQrChallengeRepository, AttendanceRepository, FarmUserRepository } from '@app/infra/persistence/typeorm';
import { RedisPublisher } from '@app/infra/redis';

import { CheckInAttendanceCommand, CheckOutAttendanceCommand } from './commands';
import { AttendanceQrCodeGeneratedEvent } from './events';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisPublisher: RedisPublisher,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly attendanceQrChallengeRepository: AttendanceQrChallengeRepository,
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

    const attendanceQrChallenge = await this.dataSource.transaction(async (em) => {
      const { affected, deviceId } = await this.attendanceQrChallengeRepository.deleteById(command.crCode, em);

      if (!affected) {
        throw new Error('invalid qr code');
      }

      const attendanceQrChallenge = AttendanceQrChallenge.of(farmUser.farmId, deviceId);
      await this.attendanceQrChallengeRepository.insert(attendanceQrChallenge, em);
      await this.attendanceRepository.upsertOrIgnore(Attendance.of(farmUser.farm, farmUser.userId), em);

      return attendanceQrChallenge;
    });

    await this.redisPublisher.publishJSON('attendance.qr.generated', AttendanceQrCodeGeneratedEvent.from(attendanceQrChallenge));
  }

  async checkOutAttendnace(command: CheckOutAttendanceCommand): Promise<void> {
    const farmUser = await this.farmUserRepository.findWithFarm(command.farmId, command.userId);

    if (!farmUser) {
      throw new Error('forbidden');
    }

    const attendanceQrChallenge = await this.dataSource.transaction(async (em) => {
      const { affected, deviceId } = await this.attendanceQrChallengeRepository.deleteById(command.crCode, em);

      if (!affected) {
        throw new Error('invalid qr code');
      }

      const attendanceQrChallenge = AttendanceQrChallenge.of(farmUser.farmId, deviceId);
      await this.attendanceQrChallengeRepository.insert(attendanceQrChallenge, em);
      await this.attendanceRepository.updateToCheckOutByWorkDate(farmUser.farmId, farmUser.userId, farmUser.farm.dateOfTimeZone, em);

      return attendanceQrChallenge;
    });

    await this.redisPublisher.publishJSON('attendance.qr.generated', AttendanceQrCodeGeneratedEvent.from(attendanceQrChallenge));
  }
}
