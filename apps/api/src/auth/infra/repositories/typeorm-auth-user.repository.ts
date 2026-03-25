import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { UserEntity, UserUsageEntity } from '@libs/persistence/typeorm';

import { AuthUserRepositoryPort } from '../../application';
import { AuthUserDraft } from '../../domain';
import { AuthTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmAuthUserRepository implements AuthUserRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(UserEntity);
  }

  async hasOneByEmail(email: string): Promise<boolean> {
    return this.getRepository().existsBy({ email });
  }

  async findOneByEmail(email: string) {
    const user = await this.getRepository().findOneBy({ email });

    return user ? AuthTypeOrmMapper.toAuthUser(user) : null;
  }

  async findOneById(id: string) {
    return AuthTypeOrmMapper.toAuthUser(await this.getRepository().findOneByOrFail({ id }));
  }

  async save(user: AuthUserDraft) {
    const savedUser = await this.getRepository().save({
      email: user.email,
      name: user.name,
      password: user.passwordHash,
      usage: new UserUsageEntity(),
    });

    return AuthTypeOrmMapper.toAuthUser(savedUser);
  }
}
