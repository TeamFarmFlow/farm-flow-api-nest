import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { FarmUserEntity } from '@libs/persistence/typeorm';

import { MemberFarmUserRepositoryPort } from '../../application';
import { Member } from '../../domain';
import { MemberTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmMemberFarmUserRepository implements MemberFarmUserRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(FarmUserEntity);
  }

  async findAndCountByFarmIdWithUser(farmId: string): Promise<[Member[], number]> {
    const [rows, total] = await this.getRepository()
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.user', 'fu.user', 'u')
      .leftJoinAndMapOne('fu.role', 'fu.role', 'r')
      .where('fu.farmId = :farmId', { farmId })
      .getManyAndCount();

    return [rows.map((row) => MemberTypeOrmMapper.toMember(row)), total];
  }

  async findOneWithRole(farmId: string, userId: string): Promise<Member | null> {
    const farmUser = await this.getRepository().findOne({
      relations: { role: true },
      where: { farmId, userId },
    });

    return farmUser ? MemberTypeOrmMapper.toMember(farmUser) : null;
  }

  async update(
    farmId: string,
    userId: string,
    member: {
      roleId?: string;
      payRatePerHour?: number;
      payDeductionAmount?: number;
    },
  ): Promise<void> {
    await this.getRepository().update({ farmId, userId }, { ...member, updatedAt: () => 'NOW()' });
  }

  async delete(farmId: string, userId: string): Promise<void> {
    await this.getRepository().delete({ farmId, userId });
  }
}
