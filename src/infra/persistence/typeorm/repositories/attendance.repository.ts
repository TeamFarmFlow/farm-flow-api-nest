import { InjectRepository } from '@nestjs/typeorm';

import { And, DeepPartial, EntityManager, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { AttendanceStatus } from '@app/shared/domain';

import { TransactionalRepository, TypeOrmExRepository } from '../common';
import { Attendance, FarmUser, Role, User } from '../entities';

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

@TypeOrmExRepository(Attendance)
export class AttendanceRepository extends TransactionalRepository<Attendance> {
  constructor(
    @InjectRepository(Attendance)
    repository: Repository<Attendance>,
  ) {
    super(repository);
  }

  async findByFarmIdAndUserIdAndDateRange(farmId: string, userId: string, startDate: string, endDate: string, em?: EntityManager) {
    return this.getRepository(em).findAndCount({
      where: {
        farmId,
        userId,
        workDate: And(MoreThanOrEqual(startDate), LessThanOrEqual(endDate)),
      },
      order: { workDate: 'DESC' },
    });
  }

  async findPayrollsByFarmIdAndDateRange(farmId: string, startDate: string, endDate: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('a')
      .innerJoin(FarmUser, 'fu', 'fu.farmId = a.farmId AND fu.userId = a.userId')
      .innerJoin(User, 'u', 'u.id = a.userId')
      .leftJoin(Role, 'r', 'r.id = fu.roleId')
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
  }

  async findPayrollsByFarmIdAndUserIdAndDateRange(farmId: string, userId: string, startDate: string, endDate: string, em?: EntityManager) {
    return this.getRepository(em).find({
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
  }

  async findByWorkDate(farmId: string, userId: string, workDate: string, em?: EntityManager) {
    return this.getRepository(em).findOneBy({
      farmId,
      userId,
      workDate,
    });
  }

  async findByWorkDateOrFail(farmId: string, userId: string, workDate: string, em?: EntityManager) {
    return this.getRepository(em).findOneByOrFail({
      farmId,
      userId,
      workDate,
    });
  }

  async upsertOrIgnore(entityLike: DeepPartial<Attendance>, em?: EntityManager) {
    return this.getRepository(em).createQueryBuilder().insert().values(entityLike).orIgnore().execute();
  }

  async update(id: string, farmId: string, userId: string, checkedInAt: Date, checkedOutAt: Date, em?: EntityManager) {
    return this.getRepository(em).update(
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

  async updateToCheckOutByWorkDate(farmId: string, userId: string, workDate: string, em?: EntityManager) {
    return this.getRepository(em).update(
      { farmId, userId, workDate },
      {
        status: AttendanceStatus.CheckOut,
        checkedOutAt: () => 'NOW()',
        seconds: () => 'EXTRACT(EPOCH FROM (NOW() - "checked_in_at"))::int',
        updatedAt: () => 'NOW()',
      },
    );
  }

  async delete(id: string, farmId: string, userId: string, em?: EntityManager) {
    return this.getRepository(em).softDelete({ id, farmId, userId });
  }
}
