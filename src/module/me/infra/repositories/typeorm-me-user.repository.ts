import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { UserEntity } from '@app/infra/persistence/typeorm';

import { MeUserRepositoryPort } from '../../application';

@Injectable()
export class TypeOrmMeUserRepository implements MeUserRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(UserEntity);
  }

  async updateName(userId: string, name: string): Promise<void> {
    await this.getRepository().update(userId, { name, updatedAt: () => 'NOW()' });
  }
}
