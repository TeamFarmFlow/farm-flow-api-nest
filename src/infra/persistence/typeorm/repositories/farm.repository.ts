import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { Farm } from '@app/infra/persistence/typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';

@TypeOrmExRepository(Farm)
export class FarmRepository extends TransactionalRepository<Farm> {
  constructor(
    @InjectRepository(Farm)
    repository: Repository<Farm>,
  ) {
    super(repository);
  }

  async hasById(id: string, em?: EntityManager) {
    return this.getRepository(em).existsBy({ id });
  }

  async findOneById(id: string, em?: EntityManager) {
    return this.getRepository(em).findOneBy({ id });
  }

  async insert(entityLike: DeepPartial<Farm>, em?: EntityManager) {
    return this.getRepository(em).insert(entityLike);
  }

  async save(entityLike: DeepPartial<Farm>, em?: EntityManager) {
    return this.getRepository(em).save(entityLike);
  }

  async update(id: string, entityLike: DeepPartial<Farm>, em?: EntityManager) {
    const { affected } = await this.getRepository(em).update({ id }, { ...entityLike, updatedAt: () => 'NOW()' });

    return { affected: affected ? true : false };
  }
}
