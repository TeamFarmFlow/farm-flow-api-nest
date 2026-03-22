import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { FarmUserEntity } from '@libs/persistence/typeorm';

import { InvitationFarmUserRepositoryPort } from '../../application';
import { InvitationFarm } from '../../domain';

@Injectable()
export class TypeOrmInvitationFarmUserRepository implements InvitationFarmUserRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(FarmUserEntity);
  }

  async has(farmId: string, userId: string): Promise<boolean> {
    return this.getRepository().existsBy({ farmId, userId });
  }

  async upsertOrIgnore(farm: InvitationFarm, userId: string, roleId: string): Promise<void> {
    await this.getRepository()
      .createQueryBuilder()
      .insert()
      .values({
        farmId: farm.id,
        userId,
        roleId,
        payRatePerHour: farm.payRatePerHour,
        payDeductionAmount: farm.payDeductionAmount,
      })
      .orIgnore()
      .execute();
  }
}
