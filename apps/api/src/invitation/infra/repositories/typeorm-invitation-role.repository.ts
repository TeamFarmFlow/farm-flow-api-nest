import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { RoleEntity } from '@libs/persistence/typeorm';

import { InvitationRoleRepositoryPort } from '../../application';

@Injectable()
export class TypeOrmInvitationRoleRepository implements InvitationRoleRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(RoleEntity);
  }

  async findDefaultIdOrFail(farmId: string): Promise<string> {
    const role = await this.getRepository().findOneByOrFail({
      farmId,
      required: true,
      super: false,
    });

    return role.id;
  }
}
