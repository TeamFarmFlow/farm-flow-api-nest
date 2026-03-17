import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { User } from '@app/infra/persistence/typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';

@TypeOrmExRepository(User)
export class UserRepository extends TransactionalRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }

  async hasOneByEmail(email: string, em?: EntityManager) {
    return this.getRepository(em).existsBy({ email });
  }

  async findOneByEmail(email: string, em?: EntityManager) {
    return this.getRepository(em).findOneBy({ email });
  }

  async findOneById(id: string, em?: EntityManager) {
    return this.getRepository(em).findOneByOrFail({ id });
  }

  async update(id: string, entityLike: DeepPartial<User>, em?: EntityManager) {
    return this.getRepository(em).update(id, {
      ...entityLike,
      updatedAt: () => 'NOW()',
    });
  }

  async save(user: DeepPartial<User>, em?: EntityManager) {
    return this.getRepository(em).save(user);
  }
}
