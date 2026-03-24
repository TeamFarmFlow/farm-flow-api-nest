import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager, UpdateResult } from 'typeorm';

import { UserUsageEntity } from '@libs/persistence/typeorm';

import { FarmUserUsageRepositoryPort } from '../../application';

@Injectable()
export class TypeOrmFarmUserUsageRepositoryAdapter implements FarmUserUsageRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(UserUsageEntity);
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
