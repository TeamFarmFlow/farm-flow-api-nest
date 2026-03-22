import { Injectable } from '@nestjs/common';

import { And, DataSource, EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { AttendanceEntity, FarmUserEntity, RoleEntity, UserEntity } from '@app/infra/persistence/typeorm';
import { AttendanceStatus } from '@app/shared/domain';

import { PayrollAttendanceRepositoryPort } from '../../application';
import { PayrollTypeOrmMapper } from '../mappers';

type AttendancePayrollRawRow = {
  user_id: string;
  user_name: string;
  role_id: string | null;
  role_name: string | null;
  role_super: boolean | null;
  role_required: boolean | null;
  pay_rate_per_hour: number;
  pay_deduction_amount: number;
  seconds: string | number;
  need_check: boolean;
};

@Injectable()
export class TypeOrmPayrollAttendanceRepository implements PayrollAttendanceRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(AttendanceEntity);
  }

  async findPayrollsByFarmIdAndDateRange(farmId: string, startDate: string, endDate: string) {
    const rows = await this.getRepository()
      .createQueryBuilder('a')
      .innerJoin(FarmUserEntity, 'fu', 'fu.farmId = a.farmId AND fu.userId = a.userId')
      .innerJoin(UserEntity, 'u', 'u.id = a.userId')
      .leftJoin(RoleEntity, 'r', 'r.id = fu.roleId')
      .select([
        'u.id as user_id',
        'u.name as user_name',
        'r.id as role_id',
        'r.name as role_name',
        'r.super as role_super',
        'r.required as role_required',
        'fu.payRatePerHour as pay_rate_per_hour',
        'fu.payDeductionAmount as pay_deduction_amount',
        'SUM(a.seconds) as seconds',
        'BOOL_OR(a.checkedOutAt IS NULL) as "need_check"',
      ])
      .where('a.farmId = :farmId', { farmId })
      .andWhere('a.workDate >= :startDate', { startDate })
      .andWhere('a.workDate <= :endDate', { endDate })
      .andWhere('a.payrolled IS FALSE')
      .andWhere('a.deletedAt IS NULL')
      .groupBy('u.id')
      .addGroupBy('u.name')
      .addGroupBy('r.id')
      .addGroupBy('r.name')
      .addGroupBy('r.super')
      .addGroupBy('r.required')
      .addGroupBy('fu.payRatePerHour')
      .addGroupBy('fu.payDeductionAmount')
      .orderBy('u.id', 'ASC')
      .getRawMany<AttendancePayrollRawRow>();

    return rows.map((row) => PayrollTypeOrmMapper.toPayroll(row));
  }

  async findPayrollAttendancesByFarmIdAndUserIdAndDateRange(farmId: string, userId: string, startDate: string, endDate: string) {
    const rows = await this.getRepository().find({
      select: {
        id: true,
        workDate: true,
        status: true,
        checkedInAt: true,
        checkedOutAt: true,
        seconds: true,
      },
      where: {
        farmId,
        userId,
        workDate: And(MoreThanOrEqual(startDate), LessThanOrEqual(endDate)),
      },
      order: {
        workDate: 'ASC',
      },
    });

    return rows.map((row) => PayrollTypeOrmMapper.toPayrollAttendance(row));
  }

  async update(id: string, farmId: string, userId: string, checkedInAt: Date, checkedOutAt: Date): Promise<void> {
    await this.getRepository().update(
      { id, farmId, userId },
      {
        status: AttendanceStatus.CheckOut,
        checkedInAt,
        checkedOutAt,
        seconds: () => 'EXTRACT(EPOCH FROM (NOW() - "checked_in_at"))::int',
        updatedAt: () => 'NOW()',
      },
    );
  }

  async delete(id: string, farmId: string, userId: string): Promise<void> {
    await this.getRepository().softDelete({ id, farmId, userId });
  }
}
