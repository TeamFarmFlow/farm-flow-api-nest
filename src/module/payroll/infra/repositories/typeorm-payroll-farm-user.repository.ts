import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { FarmUserEntity } from '@app/infra/persistence/typeorm';

import { PayrollFarmUserRepositoryPort } from '../../application';
import { PayrollFarmUser } from '../../domain';
import { PayrollTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmPayrollFarmUserRepository implements PayrollFarmUserRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(FarmUserEntity);
  }

  async findOne(farmId: string, userId: string): Promise<PayrollFarmUser | null> {
    const farmUser = await this.getRepository().findOneBy({ farmId, userId });
    return farmUser ? PayrollTypeOrmMapper.toPayrollFarmUser(farmUser) : null;
  }
}
