import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { FarmUserEntity } from '@libs/persistence/typeorm';

import { RoleFarmUserRepositoryPort } from '../../application';
import { Role } from '../../domain';
import { RoleTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmRoleFarmUserRepository implements RoleFarmUserRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(FarmUserEntity);
  }

  async findRole(farmId: string, userId: string): Promise<Role | null> {
    const farmUser = await this.getRepository()
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.role', 'fu.role', 'role')
      .where('fu.farmId = :farmId', { farmId })
      .andWhere('fu.userId = :userId', { userId })
      .getOneOrFail();

    return farmUser.role ? RoleTypeOrmMapper.toRole(farmUser.role) : null;
  }

  async findUsersByRoleId(roleId: string, em?: EntityManager) {
    const farmUsers = await this.getRepository(em).find({
      relations: { user: true },
      where: { role: { id: roleId } },
    });

    return farmUsers.map((farmUser) => RoleTypeOrmMapper.toRoleUser(farmUser.user));
  }

  async updateRole(currentRoleId: string, updateRoleId: string, em?: EntityManager): Promise<void> {
    await this.getRepository(em).update({ roleId: currentRoleId }, { roleId: updateRoleId, updatedAt: () => 'NOW()' });
  }
}
