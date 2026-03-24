import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { RoleEntity } from '@libs/persistence/typeorm';
import { PermissionKey } from '@libs/shared';

import { FarmRoleRepositoryPort } from '../../application';
import { FarmTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmFarmRoleRepositoryAdapter implements FarmRoleRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(RoleEntity);
  }

  async save(
    role: {
      farmId: string;
      name: string;
      required: boolean;
      super: boolean;
      permissionKeys: PermissionKey[];
    },
    em?: EntityManager,
  ) {
    const savedRole = await this.getRepository(em).save({
      farm: { id: role.farmId },
      name: role.name,
      required: role.required,
      super: role.super,
      permissions: role.permissionKeys.map((key) => ({ key })),
    });

    return FarmTypeOrmMapper.toFarmRole(savedRole);
  }
}
