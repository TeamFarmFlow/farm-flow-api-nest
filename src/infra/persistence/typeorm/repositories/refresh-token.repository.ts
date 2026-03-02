import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { RefreshToken, TransactionalRepository, TypeOrmExRepository } from '@app/infra/persistence/typeorm';

@TypeOrmExRepository(RefreshToken)
export class RefreshTokenRepository extends TransactionalRepository<RefreshToken> {
  constructor(
    @InjectRepository(RefreshToken)
    repository: Repository<RefreshToken>,
  ) {
    super(repository);
  }

  async findValidByIdWithUser(id: string, em?: EntityManager) {
    return this.getRepository(em).createQueryBuilder('r').innerJoinAndMapOne('r.user', 'r.user', 'u').where('r.id = :id', { id }).andWhere('r.expiredAt > NOW()').getOne();
  }

  async insert(entityLike: DeepPartial<RefreshToken>, em?: EntityManager) {
    return this.getRepository(em).insert(entityLike);
  }

  async deleteById(id: string, em?: EntityManager) {
    return this.getRepository(em).delete({ id });
  }

  async countByUserId(em?: EntityManager) {
    return this.getRepository(em).countBy({});
  }
}
