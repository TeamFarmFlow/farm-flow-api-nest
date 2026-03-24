import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { RolePermissionEntity } from '@libs/persistence/typeorm';
import { PermissionKey } from '@libs/shared';

import { RolePermissionRepositoryPort } from '../../application';

@Injectable()
export class TypeOrmRolePermissionRepository implements RolePermissionRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(RolePermissionEntity);
  }

  async findKeysByRoleId(roleId: string): Promise<PermissionKey[]> {
    const permissions = await this.getRepository().find({
      select: { key: true },
      where: { roleId },
    });

    return permissions.map(({ key }) => key);
  }

  async saveAll(permissions: Array<{ id?: string; roleId: string; key: PermissionKey }>, em?: EntityManager): Promise<void> {
    await this.getRepository(em).save(permissions);
  }

  async deleteInIds(ids: string[], em?: EntityManager): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    await this.getRepository(em).delete(ids);
  }
}
