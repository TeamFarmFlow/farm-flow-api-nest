import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { FarmEntity } from '@app/infra/persistence/typeorm';

import { FarmRepositoryPort } from '../../application';
import { FarmTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmFarmRepositoryAdapter implements FarmRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(FarmEntity);
  }

  async save(
    farm: {
      name: string;
      payRatePerHour: number;
      payDeductionAmount: number;
    },
    em?: EntityManager,
  ) {
    return FarmTypeOrmMapper.toFarm(await this.getRepository(em).save(farm));
  }

  async update(
    id: string,
    farm: {
      name?: string;
      payRatePerHour?: number;
      payDeductionAmount?: number;
    },
    em?: EntityManager,
  ) {
    const { affected } = await this.getRepository(em).update({ id }, { ...farm, updatedAt: () => 'NOW()' });

    return { affected: affected ? true : false };
  }
}
