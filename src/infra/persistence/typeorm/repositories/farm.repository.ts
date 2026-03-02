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

  async update(id: string, entityLike: DeepPartial<Farm>, em?: EntityManager) {
    const { affected } = await this.getRepository(em).update({ id }, { ...entityLike, updatedAt: () => 'NOW()' });

    return { affected: affected ? true : false };
  }

  async save(entityLike: DeepPartial<Farm>, em?: EntityManager) {
    return this.getRepository(em).save(entityLike);
  }

  async insert(entityLike: DeepPartial<Farm>, em?: EntityManager) {
    return this.getRepository(em).insert(entityLike);
  }
}
