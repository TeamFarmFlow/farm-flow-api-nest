import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';
import { Role } from '../entities';

@TypeOrmExRepository(Role)
export class RoleRepository extends TransactionalRepository<Role> {
  constructor(
    @InjectRepository(Role)
    repository: Repository<Role>,
  ) {
    super(repository);
  }

  async findBySuper(em?: EntityManager) {
    return this.getRepository(em).findBy({ super: true });
  }

  async findAndCountByFarmIdWithPermissions(farmId: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('r')
      .leftJoinAndMapMany('r.permissions', 'r.permissions', 'permissions')
      .where('r.farmId = :farmId', { farmId })
      .getManyAndCount();
  }

  async insert(entityLike: DeepPartial<Role>, em?: EntityManager) {
    return this.getRepository(em).insert(entityLike);
  }

  async save(entityLike: DeepPartial<Role>, em?: EntityManager) {
    return this.getRepository(em).save(entityLike);
  }
}
