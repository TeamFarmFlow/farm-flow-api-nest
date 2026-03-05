import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { AttendanceStatus } from '@app/shared/domain';

import { TransactionalRepository, TypeOrmExRepository } from '../common';
import { Attendance } from '../entities';

@TypeOrmExRepository(Attendance)
export class AttendanceRepository extends TransactionalRepository<Attendance> {
  constructor(
    @InjectRepository(Attendance)
    repository: Repository<Attendance>,
  ) {
    super(repository);
  }

  async findByWorkDate(farmId: string, userId: string, workDate: string, em?: EntityManager) {
    return this.getRepository(em).findOneBy({
      farmId,
      userId,
      workDate,
    });
  }

  async upsertOrIgnore(entityLike: DeepPartial<Attendance>, em?: EntityManager) {
    return this.getRepository(em).createQueryBuilder().insert().values(entityLike).orIgnore().execute();
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
}
