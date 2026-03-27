import { Injectable } from '@nestjs/common';

import { And, DataSource, EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { AttendanceEntity } from '@libs/persistence/typeorm';
import { AttendanceStatus } from '@libs/shared';

import { AttendanceRepositoryPort } from '../../application';
import { Attendance } from '../../domain';
import { AttendanceTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmAttendanceRepository implements AttendanceRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(AttendanceEntity);
  }

  async findByFarmIdAndUserIdAndDateRange(farmId: string, userId: string, startDate: string, endDate: string): Promise<[Attendance[], number]> {
    const [rows, total] = await this.getRepository().findAndCount({
      where: {
        farmId,
        userId,
        workDate: And(MoreThanOrEqual(startDate), LessThanOrEqual(endDate)),
      },
      order: { workDate: 'DESC' },
    });

    return [rows.map((attendance) => AttendanceTypeOrmMapper.toAttendance(attendance)), total];
  }

  async findByWorkDate(farmId: string, userId: string, workDate: string) {
    const attendance = await this.getRepository().findOneBy({ farmId, userId, workDate });

    return attendance ? AttendanceTypeOrmMapper.toAttendance(attendance) : null;
  }

  async findByWorkDateOrFail(farmId: string, userId: string, workDate: string) {
    return AttendanceTypeOrmMapper.toAttendance(await this.getRepository().findOneByOrFail({ farmId, userId, workDate }));
  }

  async upsertCheckInByWorkDate(farmId: string, userId: string, workDate: string): Promise<void> {
    await this.getRepository()
      .createQueryBuilder()
      .insert()
      .values({
        farmId,
        userId,
        workDate,
        status: AttendanceStatus.CheckIn,
      })
      .orIgnore()
      .execute();
  }

  async updateToCheckOutByWorkDate(farmId: string, userId: string, workDate: string): Promise<void> {
    await this.getRepository().update(
      { farmId, userId, workDate },
      {
        status: AttendanceStatus.CheckOut,
        checkedOutAt: () => 'NOW()',
        seconds: () => 'EXTRACT(EPOCH FROM (:checkedOutAt::timestamptz - :checkedInAt::timestamptz))::int',
        updatedAt: () => 'NOW()',
      },
    );
  }
}
