import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { RolePermission } from '@app/infra/persistence/typeorm';
import { PermissionKey } from '@app/shared/domain';

import { AuthRolePermissionRepositoryPort } from '../../application';

@Injectable()
export class TypeOrmAuthRolePermissionRepository implements AuthRolePermissionRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(RolePermission);
  }

  async findKeysByRoleId(roleId: string): Promise<PermissionKey[]> {
    const permissions = await this.getRepository().find({
      select: { key: true },
      where: { roleId },
    });

    return permissions.map(({ key }) => key);
  }
}
