import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { UserEntity } from '@libs/persistence/typeorm';

import { InvitationUserRepositoryPort } from '../../application';
import { InvitationUser } from '../../domain';
import { InvitationTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmInvitationUserRepository implements InvitationUserRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(UserEntity);
  }

  async findOneByEmail(email: string): Promise<InvitationUser | null> {
    const user = await this.getRepository().findOneBy({ email });
    return user ? InvitationTypeOrmMapper.toInvitationUser(user) : null;
  }

  async findOneByIdOrFail(id: string): Promise<InvitationUser> {
    return InvitationTypeOrmMapper.toInvitationUser(await this.getRepository().findOneByOrFail({ id }));
  }
}
