import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';
import { AttendanceQrChallenge } from '../entities';

@TypeOrmExRepository(AttendanceQrChallenge)
export class AttendanceQrChallengeRepository extends TransactionalRepository<AttendanceQrChallenge> {
  constructor(
    @InjectRepository(AttendanceQrChallenge)
    repository: Repository<AttendanceQrChallenge>,
  ) {
    super(repository);
  }

  async insert(entityLike: DeepPartial<AttendanceQrChallenge>, em?: EntityManager) {
    return this.getRepository(em).insert(entityLike);
  }

  async deleteById(id: string, em?: EntityManager) {
    const { affected } = await this.getRepository(em)
      .createQueryBuilder('a')
      .delete()
      .where('a.id = :id', { id })
      .andWhere('a.expiresAt > NOW()')
      .andWhere('a.consumedAt IS NULL')
      .execute();

    return (affected ?? 0) > 0 ? true : false;
  }
}
