import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { FarmUser } from '@app/infra/persistence/typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';

@TypeOrmExRepository(FarmUser)
export class FarmUserRepository extends TransactionalRepository<FarmUser> {
  constructor(
    @InjectRepository(FarmUser)
    repository: Repository<FarmUser>,
  ) {
    super(repository);
  }

  async has(farmId: string, userId: string, em?: EntityManager) {
    return this.getRepository(em).existsBy({ farmId, userId });
  }

  async findWithRole(farmId: string, userId: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.role', 'fu.role', 'role')
      .where('fu.farmId = :farmId', { farmId })
      .andWhere('fu.userId = :userId', { userId })
      .getOne();
  }

  async findAndCountByUserIdWithFarm(userId: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.farm', 'fu.farm', 'f')
      .leftJoinAndMapOne('fu.role', 'fu.role', 'r')
      .where('fu.userId = :userId', { userId })
      .getManyAndCount();
  }

  async save(entityLike: DeepPartial<FarmUser>, em?: EntityManager) {
    return this.getRepository(em).save(entityLike);
  }

  async insert(entityLike: DeepPartial<FarmUser>, em?: EntityManager) {
    return this.getRepository(em).insert(entityLike);
  }

  async delete(farmId: string, userId: string, em?: EntityManager) {
    const { affected } = await this.getRepository(em).delete({ farmId, userId });

    return { affected: affected ? true : false };
  }
}
