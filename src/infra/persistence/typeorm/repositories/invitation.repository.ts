import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { InvitationStatus } from '@app/shared/domain';

import { TransactionalRepository, TypeOrmExRepository } from '../common';
import { Invitation } from '../entities';

@TypeOrmExRepository(Invitation)
export class InvitationRepository extends TransactionalRepository<Invitation> {
  constructor(
    @InjectRepository(Invitation)
    repository: Repository<Invitation>,
  ) {
    super(repository);
  }

  async findValidByCode(code: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('i')
      .where('i.code = :code', { code })
      .andWhere('i.status = :status', { status: InvitationStatus.Published })
      .andWhere('i.expiredAt > NOW()')
      .getOne();
  }

  async insert(entityLike: DeepPartial<Invitation>, em?: EntityManager) {
    return this.getRepository(em).insert(entityLike);
  }

  async update(id: string, entityLike: DeepPartial<Invitation>, em?: EntityManager) {
    return this.getRepository(em).update(id, { ...entityLike, updatedAt: () => 'NOW()' });
  }
}
