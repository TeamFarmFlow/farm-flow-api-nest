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

  async findByIdWithPermissions(id: string, em?: EntityManager) {
    return this.getRepository(em).findOne({
      relations: { permissions: true },
      where: { id },
    });
  }

  async findById(id: string, em?: EntityManager) {
    return this.getRepository(em).findOne({
      where: { id },
    });
  }

  async findDefault(farmId: string, em?: EntityManager) {
    return this.getRepository(em).findOneByOrFail({
      farmId,
      required: true,
      super: false,
    });
  }

  async insert(entityLike: DeepPartial<Role>, em?: EntityManager) {
    return this.getRepository(em).insert(entityLike);
  }

  async save(entityLike: DeepPartial<Role>, em?: EntityManager) {
    return this.getRepository(em).save(entityLike);
  }

  async update(id: string, entityLike: DeepPartial<Role>, em?: EntityManager) {
    return this.getRepository(em).update(id, { ...entityLike, updatedAt: () => 'NOW()' });
  }

  async delete(id: string, em?: EntityManager) {
    return this.getRepository(em).delete(id);
  }
}
