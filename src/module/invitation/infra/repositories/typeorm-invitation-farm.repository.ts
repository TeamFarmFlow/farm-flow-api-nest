import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager, Repository } from 'typeorm';

import { FarmEntity } from '@app/infra/persistence/typeorm';

import { InvitationFarmRepositoryPort } from '../../application';
import { InvitationFarm } from '../../domain';
import { InvitationTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmInvitationFarmRepository implements InvitationFarmRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager): Repository<FarmEntity> {
    return (em ?? this.dataSource).getRepository(FarmEntity);
  }

  async findOneById(id: string): Promise<InvitationFarm | null> {
    const farm = await this.getRepository().findOneBy({ id });

    return farm ? InvitationTypeOrmMapper.toInvitationFarm(farm) : null;
  }
}
