import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { RolePermissionEntity } from '@libs/persistence/typeorm';
import { PermissionKey } from '@libs/shared';

import { AuthRolePermissionRepositoryPort } from '../../application';

@Injectable()
export class TypeOrmAuthRolePermissionRepository implements AuthRolePermissionRepositoryPort {
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
}
