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
    const result = (await this.getRepository(em)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .andWhere('expiresAt > NOW()')
      .andWhere('consumedAt IS NULL')
      .returning('deviceId')
      .execute()) as { affected: number; raw: { device_id: string }[] };

    return {
      affected: (result.affected ?? 0) > 0 ? true : false,
      deviceId: result.raw[0]?.device_id,
    };
  }
}
