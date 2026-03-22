import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { UserEntity } from '@app/infra/persistence/typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';

@TypeOrmExRepository(UserEntity)
export class UserRepository extends TransactionalRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  /**
   * @deprecated
   */
  async findOneByEmail(email: string, em?: EntityManager) {
    return this.getRepository(em).findOneBy({ email });
  }

  /**
   * @deprecated
   */
  async findOneById(id: string, em?: EntityManager) {
    return this.getRepository(em).findOneByOrFail({ id });
  }

  /**
   * @deprecated
   */
  async update(id: string, entityLike: DeepPartial<UserEntity>, em?: EntityManager) {
    return this.getRepository(em).update(id, {
      ...entityLike,
      updatedAt: () => 'NOW()',
    });
  }
}
