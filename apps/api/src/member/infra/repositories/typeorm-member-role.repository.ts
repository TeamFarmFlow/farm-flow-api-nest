import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { RoleEntity } from '@libs/persistence/typeorm';

import { MemberRoleRepositoryPort } from '../../application';
import { MemberRole } from '../../domain';
import { MemberTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmMemberRoleRepository implements MemberRoleRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(RoleEntity);
  }

  async findById(id: string): Promise<MemberRole | null> {
    const role = await this.getRepository().findOne({
      where: { id },
    });

    return role ? MemberTypeOrmMapper.toMemberRole(role) : null;
  }
}
