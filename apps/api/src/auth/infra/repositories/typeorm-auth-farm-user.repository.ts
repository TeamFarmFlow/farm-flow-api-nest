import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { FarmUserEntity } from '@libs/persistence/typeorm';

import { AuthFarmUserRepositoryPort } from '../../application';
import { AuthFarmUser } from '../../domain';
import { AuthTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmAuthFarmUserRepository implements AuthFarmUserRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(FarmUserEntity);
  }

  async findOneByFarmIdAndUserId(farmId: string, userId: string, em?: EntityManager): Promise<AuthFarmUser | null> {
    const farmUser = await this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.farm', 'fu.farm', 'farm')
      .leftJoinAndMapOne('fu.role', 'fu.role', 'role')
      .where('fu.farmId = :farmId', { farmId })
      .andWhere('fu.userId = :userId', { userId })
      .getOne();

    return farmUser ? AuthTypeOrmMapper.toAuthFarmUser(farmUser) : null;
  }
}
