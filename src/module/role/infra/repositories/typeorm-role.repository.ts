import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { RoleEntity } from '@app/infra/persistence/typeorm';
import { PermissionKey } from '@app/shared/domain';

import { RoleRepositoryPort } from '../../application';
import { Role } from '../../domain';
import { RoleTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmRoleRepository implements RoleRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(RoleEntity);
  }

  async findByIdWithPermissions(id: string, em?: EntityManager): Promise<Role | null> {
    const role = await this.getRepository(em).findOne({
      relations: { permissions: true },
      where: { id },
    });

    return role ? RoleTypeOrmMapper.toRole(role) : null;
  }

  async findAndCountByFarmIdWithPermissions(farmId: string, em?: EntityManager): Promise<[Role[], number]> {
    const [rows, total] = await this.getRepository(em)
      .createQueryBuilder('r')
      .leftJoinAndMapMany('r.permissions', 'r.permissions', 'permissions')
      .where('r.farmId = :farmId', { farmId })
      .getManyAndCount();

    return [rows.map((row) => RoleTypeOrmMapper.toRole(row)), total];
  }

  async findDefault(farmId: string, em?: EntityManager) {
    return RoleTypeOrmMapper.toRole(
      await this.getRepository(em).findOneByOrFail({
        farmId,
        required: true,
        super: false,
      }),
    );
  }

  async save(role: { farmId: string; name: string; permissionKeys: PermissionKey[] }, em?: EntityManager) {
    const savedRole = await this.getRepository(em).save({
      farmId: role.farmId,
      name: role.name,
      permissions: role.permissionKeys.map((key) => ({ key })),
    });

    return RoleTypeOrmMapper.toRole(savedRole);
  }

  async update(id: string, role: { name: string }, em?: EntityManager): Promise<void> {
    await this.getRepository(em).update(id, { ...role, updatedAt: () => 'NOW()' });
  }

  async delete(id: string, em?: EntityManager): Promise<void> {
    await this.getRepository(em).delete(id);
  }
}
