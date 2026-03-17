import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { FarmUser } from '@app/infra/persistence/typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';

@TypeOrmExRepository(FarmUser)
export class FarmUserRepository extends TransactionalRepository<FarmUser> {
  constructor(
    @InjectRepository(FarmUser)
    repository: Repository<FarmUser>,
  ) {
    super(repository);
  }

  async has(farmId: string, userId: string, em?: EntityManager) {
    return this.getRepository(em).existsBy({ farmId, userId });
  }

  async findOne(farmId: string, userId: string, em?: EntityManager) {
    return this.getRepository(em).findOneBy({ farmId, userId });
  }

  async findWithFarmAndRole(farmId: string, userId: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.farm', 'fu.farm', 'farm')
      .leftJoinAndMapOne('fu.role', 'fu.role', 'role')
      .where('fu.farmId = :farmId', { farmId })
      .andWhere('fu.userId = :userId', { userId })
      .getOne();
  }

  async findWithRole(farmId: string, userId: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.role', 'fu.role', 'role')
      .where('fu.farmId = :farmId', { farmId })
      .andWhere('fu.userId = :userId', { userId })
      .getOne();
  }

  async findWithFarm(farmId: string, userId: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.farm', 'fu.farm', 'f')
      .where('fu.farmId = :farmId', { farmId })
      .andWhere('fu.userId = :userId', { userId })
      .getOneOrFail();
  }

  async findByUserIdsWithUserAndRole(farmId: string, userIds: string[], em?: EntityManager) {
    if (userIds.length === 0) {
      return [];
    }

    return this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.user', 'fu.user', 'u')
      .leftJoinAndMapOne('fu.role', 'fu.role', 'r')
      .where('fu.farmId = :farmId', { farmId })
      .andWhere('fu.userId IN (:...userIds)', { userIds })
      .getMany();
  }

  async findAndCountByUserIdWithFarmAndRole(userId: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.farm', 'fu.farm', 'f')
      .leftJoinAndMapOne('fu.role', 'fu.role', 'r')
      .where('fu.userId = :userId', { userId })
      .getManyAndCount();
  }

  async findOneWithFarmAndRole(farmId: string, userId: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.farm', 'fu.farm', 'f')
      .leftJoinAndMapOne('fu.role', 'fu.role', 'r')
      .where('fu.farmId = :farmId', { farmId })
      .andWhere('fu.userId = :userId', { userId })
      .getOne();
  }

  async findAndCountByFarmIdWithUser(farmId: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('fu')
      .innerJoinAndMapOne('fu.user', 'fu.user', 'u')
      .leftJoinAndMapOne('fu.role', 'fu.role', 'r')
      .where('fu.farmId = :farmId', { farmId })
      .getManyAndCount();
  }

  async findByRoleId(roleId: string, em?: EntityManager) {
    return this.getRepository(em).findBy({ role: { id: roleId } });
  }

  async findByRoleIdWithUser(roleId: string, em?: EntityManager) {
    return this.getRepository(em).find({
      relations: { user: true },
      where: { role: { id: roleId } },
    });
  }

  async findOneWithRole(farmId: string, userId: string, em?: EntityManager) {
    return this.getRepository(em).findOne({
      relations: { role: true },
      where: { farmId, userId },
    });
  }

  async save(entityLike: DeepPartial<FarmUser>, em?: EntityManager) {
    return this.getRepository(em).save(entityLike);
  }

  async insert(entityLike: DeepPartial<FarmUser>, em?: EntityManager) {
    return this.getRepository(em).insert(entityLike);
  }

  async upsertOrIgnore(entityLike: DeepPartial<FarmUser>, em?: EntityManager) {
    return this.getRepository(em).createQueryBuilder().insert().values(entityLike).orIgnore().execute();
  }

  async updateRole(currentRoleId: string, updateRoleId: string, em?: EntityManager) {
    return this.getRepository(em).update({ roleId: currentRoleId }, { roleId: updateRoleId, updatedAt: () => 'NOW()' });
  }

  async update(farmId: string, userId: string, entityLike: DeepPartial<FarmUser>, em?: EntityManager) {
    return this.getRepository(em).update({ farmId, userId }, { ...entityLike, updatedAt: () => 'NOW()' });
  }

  async delete(farmId: string, userId: string, em?: EntityManager) {
    const { affected } = await this.getRepository(em).delete({ farmId, userId });

    return { affected: affected ? true : false };
  }
}
