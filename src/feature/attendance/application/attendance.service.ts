import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { Attendance, AttendanceRepository, FarmUserRepository } from '@app/infra/persistence/typeorm';
import { RedisClient, RedisPublisher } from '@app/infra/redis';

import { AttendanceQrCode, AttendanceQrCodeGeneratedEvent, InvalidQrCodeException } from '../domain';

import { CheckInAttendanceCommand, CheckOutAttendanceCommand } from './commands';
import { GetAttendanceStatisticsQuery, GetMyAttendancesQuery } from './queries';
import { GetAttendanceStatisticResult, GetMyAttendancesResult } from './results';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly redisPublisher: RedisPublisher,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async getAttendanceStatistics(query: GetAttendanceStatisticsQuery): Promise<GetAttendanceStatisticResult> {
    const rows = await this.attendanceRepository.findAttendanceStatisticsByFarmIdAndDateRange(query.farmId, query.startDate, query.endDate);

    return {
      total: rows.length,
      rows: rows.map((row) => ({
        user: {
          id: row.user_id,
          name: row.user_name,
        },
        role: row.role_id
          ? {
              id: row.role_id,
              name: row.role_name!,
              super: row.role_super!,
              required: row.role_required!,
            }
          : null,
        payRatePerHour: row.pay_rate_per_hour,
        payDeductionAmount: row.pay_deduction_amount,
        seconds: Number(row.seconds),
      })),
    };
  }

  async getMyAttendances(query: GetMyAttendancesQuery): Promise<GetMyAttendancesResult> {
    const [rows, total] = await this.attendanceRepository.findByFarmIdAndUserIdAndDateRange(query.farmId, query.userId, query.startDate, query.endDate);

    return { total, rows };
  }

  async getAttendanceByToday(farmId: string, userId: string): Promise<Attendance | null> {
    const farmUser = await this.farmUserRepository.findWithFarm(farmId, userId);

    return this.attendanceRepository.findByWorkDate(farmId, userId, farmUser.farm.dateOfTimeZone);
  }

  async checkInAttendnace(command: CheckInAttendanceCommand): Promise<Attendance> {
    const farmUser = await this.farmUserRepository.findWithFarm(command.farmId, command.userId);
    const attendanceQrCodeKey = AttendanceQrCode.from(command.qrCode).key();
    const attendanceQrCode = plainToInstance(AttendanceQrCode, await this.redisClient.getJSON(attendanceQrCodeKey));
    await this.redisClient.del(attendanceQrCodeKey);

    if (!attendanceQrCode) {
      throw new InvalidQrCodeException();
    }

    const newAttendanceQrCode = AttendanceQrCode.of(command.farmId, attendanceQrCode.deviceId);
    await this.redisClient.setJSON(newAttendanceQrCode.key(), newAttendanceQrCode);
    await this.redisClient.expire(newAttendanceQrCode.key(), newAttendanceQrCode.expiresIn());
    await this.redisPublisher.publishJSON('attendance.qr.generated', AttendanceQrCodeGeneratedEvent.from(newAttendanceQrCode));
    await this.attendanceRepository.upsertOrIgnore(Attendance.of(farmUser.farm, farmUser.userId));

    return this.attendanceRepository.findByWorkDateOrFail(farmUser.farmId, farmUser.userId, farmUser.farm.dateOfTimeZone);
  }

  async checkOutAttendnace(command: CheckOutAttendanceCommand): Promise<Attendance> {
    const farmUser = await this.farmUserRepository.findWithFarm(command.farmId, command.userId);

    const attendanceQrCodeKey = AttendanceQrCode.from(command.qrCode).key();
    const attendanceQrCode = plainToInstance(AttendanceQrCode, await this.redisClient.getJSON(attendanceQrCodeKey));
    await this.redisClient.del(attendanceQrCodeKey);

    if (!attendanceQrCode) {
      throw new InvalidQrCodeException();
    }

    const newAttendanceQrCode = AttendanceQrCode.of(command.farmId, attendanceQrCode.deviceId);
    await this.redisClient.setJSON(newAttendanceQrCode.key(), newAttendanceQrCode);
    await this.redisClient.expire(newAttendanceQrCode.key(), newAttendanceQrCode.expiresIn());
    await this.redisPublisher.publishJSON('attendance.qr.generated', AttendanceQrCodeGeneratedEvent.from(newAttendanceQrCode));
    await this.attendanceRepository.updateToCheckOutByWorkDate(farmUser.farmId, farmUser.userId, farmUser.farm.dateOfTimeZone);

    return this.attendanceRepository.findByWorkDateOrFail(farmUser.farmId, farmUser.userId, farmUser.farm.dateOfTimeZone);
  }
}
