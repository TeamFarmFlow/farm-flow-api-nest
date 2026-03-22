import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { FarmUserEntity } from '@app/infra/persistence/typeorm';

import { FarmUserRepositoryPort } from '../../application';
import { FarmUser } from '../../domain';
import { FarmTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmFarmUserRepositoryAdapter implements FarmUserRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(FarmUserEntity);
  }

  async has(farmId: string, userId: string, em?: EntityManager) {
    return this.getRepository(em).existsBy({ farmId, userId });
  }

  async findAndCountByUserIdWithFarmAndRole(userId: string, em?: EntityManager): Promise<[FarmUser[], number]> {
    const [rows, total] = await this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.farm', 'fu.farm', 'f')
      .leftJoinAndMapOne('fu.role', 'fu.role', 'r')
      .where('fu.userId = :userId', { userId })
      .getManyAndCount();

    return [rows.map((row) => FarmTypeOrmMapper.toFarmUser(row)), total];
  }

  async findOneByFarmIdAndUserIdWithFarmAndRole(farmId: string, userId: string, em?: EntityManager) {
    const farmUser = await this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.farm', 'fu.farm', 'f')
      .leftJoinAndMapOne('fu.role', 'fu.role', 'r')
      .where('fu.farmId = :farmId', { farmId })
      .andWhere('fu.userId = :userId', { userId })
      .getOne();

    return farmUser ? FarmTypeOrmMapper.toFarmUser(farmUser) : null;
  }

  async findRoleIdByFarmIdAndUserId(farmId: string, userId: string, em?: EntityManager) {
    const farmUser = await this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.role', 'fu.role', 'role')
      .where('fu.farmId = :farmId', { farmId })
      .andWhere('fu.userId = :userId', { userId })
      .getOne();

    return farmUser?.roleId ?? null;
  }

  async insert(
    farmUser: {
      farmId: string;
      userId: string;
      roleId: string | null;
    },
    em?: EntityManager,
  ): Promise<void> {
    await this.getRepository(em).insert(farmUser);
  }

  async delete(farmId: string, userId: string, em?: EntityManager) {
    const { affected } = await this.getRepository(em).delete({ farmId, userId });

    return { affected: affected ? true : false };
  }
}
