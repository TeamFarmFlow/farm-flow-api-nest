import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { FarmUserEntity } from '@app/infra/persistence/typeorm';

import { RoleFarmUserRepositoryPort } from '../../application';
import { RoleTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmRoleFarmUserRepository implements RoleFarmUserRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(FarmUserEntity);
  }

  async findWithRole(farmId: string, userId: string) {
    const farmUser = await this.getRepository()
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.role', 'fu.role', 'role')
      .where('fu.farmId = :farmId', { farmId })
      .andWhere('fu.userId = :userId', { userId })
      .getOneOrFail();

    return {
      user: RoleTypeOrmMapper.toRoleUser(farmUser.user),
      role: farmUser.role ? RoleTypeOrmMapper.toRole(farmUser.role) : null,
    };
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
