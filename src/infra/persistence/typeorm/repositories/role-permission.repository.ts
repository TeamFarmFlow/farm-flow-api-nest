import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';
import { RolePermission } from '../entities';

@TypeOrmExRepository(RolePermission)
export class RolePermissionRepository extends TransactionalRepository<RolePermission> {
  constructor(
    @InjectRepository(RolePermission)
    repository: Repository<RolePermission>,
  ) {
    super(repository);
  }

  async findKeysByRoleId(roleId: string, em?: EntityManager) {
    return this.getRepository(em).find({
      select: { key: true },
      where: { roleId },
    });
  }

  async upsert(entityLikes: DeepPartial<RolePermission> | DeepPartial<RolePermission>[], em?: EntityManager) {
    return this.getRepository(em).upsert(entityLikes, {
      conflictPaths: { roleId: true, key: true },
    });
  }

  async saves(entityLikes: DeepPartial<RolePermission>[], em?: EntityManager) {
    return this.getRepository(em).save(entityLikes);
  }
}
