import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, In, Repository } from 'typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';
import { RolePermissionEntity } from '../entities';

@TypeOrmExRepository(RolePermissionEntity)
export class RolePermissionRepository extends TransactionalRepository<RolePermissionEntity> {
  constructor(
    @InjectRepository(RolePermissionEntity)
    repository: Repository<RolePermissionEntity>,
  ) {
    super(repository);
  }

  async findKeysByRoleId(roleId: string, em?: EntityManager) {
    return this.getRepository(em).find({
      select: { key: true },
      where: { roleId },
    });
  }

  async findKeysByRoleIds(roleIds: string[], em?: EntityManager) {
    if (roleIds.length === 0) {
      return [];
    }

    return this.getRepository(em).find({
      select: { roleId: true, key: true },
      where: { roleId: In(roleIds) },
    });
  }

  async upsert(entityLikes: DeepPartial<RolePermissionEntity> | DeepPartial<RolePermissionEntity>[], em?: EntityManager) {
    return this.getRepository(em).upsert(entityLikes, {
      conflictPaths: { roleId: true, key: true },
    });
  }

  async saves(entityLikes: DeepPartial<RolePermissionEntity>[], em?: EntityManager) {
    return this.getRepository(em).save(entityLikes);
  }

  async deleteInIds(ids: string[], em?: EntityManager) {
    if (ids.length === 0) {
      return;
    }

    return this.getRepository(em).delete(ids);
  }
}
