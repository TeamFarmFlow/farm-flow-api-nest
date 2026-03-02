import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository, UpdateResult } from 'typeorm';

import { UserUsage } from '@app/infra/persistence/typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';

@TypeOrmExRepository(UserUsage)
export class UserUsageRepository extends TransactionalRepository<UserUsage> {
  constructor(
    @InjectRepository(UserUsage)
    repository: Repository<UserUsage>,
  ) {
    super(repository);
  }

  async save(entityLike: DeepPartial<UserUsage>, em?: EntityManager) {
    return this.getRepository(em).save(entityLike);
  }

  async tryIncreaseFarmCount(userId: string, em?: EntityManager) {
    const { affected, raw } = (await this.getRepository(em)
      .createQueryBuilder()
      .update({
        farmCount: () => 'farmCount + 1',
        updatedAt: () => 'NOW()',
      })
      .where('userId = :userId', { userId })
      .andWhere('farmCount < farmLimit')
      .returning(['farmCount'])
      .execute()) as Pick<UpdateResult, 'affected'> & { raw: { farm_count: number }[] };

    return {
      affected: affected ? true : false,
      farmCount: raw[0]?.farm_count ?? -1,
    };
  }

  async tryDecreaseFarmCount(userId: string, em?: EntityManager) {
    const { affected, raw } = (await this.getRepository(em)
      .createQueryBuilder()
      .update({
        farmCount: () => 'farmCount - 1',
        updatedAt: () => 'NOW()',
      })
      .where('userId = :userId', { userId })
      .andWhere('farmCount > 0')
      .returning(['farmCount'])
      .execute()) as Pick<UpdateResult, 'affected'> & { raw: { farm_count: number }[] };

    return {
      affected: affected ? true : false,
      farmCount: raw[0]?.farm_count ?? -1,
    };
  }
}
