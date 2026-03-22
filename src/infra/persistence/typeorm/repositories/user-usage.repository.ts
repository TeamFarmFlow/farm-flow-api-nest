import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { UserUsageEntity } from '@app/infra/persistence/typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';

@TypeOrmExRepository(UserUsageEntity)
export class UserUsageRepository extends TransactionalRepository<UserUsageEntity> {
  constructor(
    @InjectRepository(UserUsageEntity)
    repository: Repository<UserUsageEntity>,
  ) {
    super(repository);
  }

  async save(entityLike: DeepPartial<UserUsageEntity>, em?: EntityManager) {
    return this.getRepository(em).save(entityLike);
  }
}
