import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, In, Repository } from 'typeorm';

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

  async findKeysByRoleIds(roleIds: string[], em?: EntityManager) {
    if (roleIds.length === 0) {
      return [];
    }

    return this.getRepository(em).find({
      select: { roleId: true, key: true },
      where: { roleId: In(roleIds) },
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

  async deleteInIds(ids: string[], em?: EntityManager) {
    if (ids.length === 0) {
      return;
    }

    return this.getRepository(em).delete(ids);
  }
}
