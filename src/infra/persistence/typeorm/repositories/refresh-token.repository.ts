import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { RefreshToken, TransactionalRepository, TypeOrmExRepository } from '@app/infra/persistence/typeorm';

@TypeOrmExRepository(RefreshToken)
export class RefreshTokenRepository extends TransactionalRepository<RefreshToken> {
  constructor(
    @InjectRepository(RefreshToken)
    repository: Repository<RefreshToken>,
  ) {
    super(repository);
  }

  async findValidByIdWithUserAndFarmOrFail(id: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('refreshToken')
      .innerJoinAndMapOne('refreshToken.user', 'refreshToken.user', 'user')
      .leftJoinAndMapOne('refreshToken.farm', 'refreshToken.farm', 'farm')
      .leftJoinAndMapOne('farm.farmUser', 'farm.farmUser', 'farmUser', 'farmUser.farmId = farm.id AND farmUser.userId = user.id')
      .leftJoinAndMapOne('farmUser.role', 'farmUser.role', 'role')
      .where('refreshToken.id = :id', { id })
      .andWhere('refreshToken.expiredAt > NOW()')
      .getOneOrFail();
  }

  async findValidByIdWithUserAndFarm(id: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('refreshToken')
      .innerJoinAndMapOne('refreshToken.user', 'refreshToken.user', 'user')
      .leftJoinAndMapOne('refreshToken.farm', 'refreshToken.farm', 'farm')
      .leftJoinAndMapOne('farm.farmUser', 'farm.farmUser', 'farmUser', 'farmUser.farmId = farm.id AND farmUser.userId = user.id')
      .leftJoinAndMapOne('farmUser.role', 'farmUser.role', 'role')
      .where('refreshToken.id = :id', { id })
      .andWhere('refreshToken.expiredAt > NOW()')
      .getOne();
  }

  async insert(entityLike: DeepPartial<RefreshToken>, em?: EntityManager) {
    return this.getRepository(em).insert(entityLike);
  }

  async deleteById(id: string, em?: EntityManager) {
    return this.getRepository(em).delete({ id });
  }

  async countByUserId(em?: EntityManager) {
    return this.getRepository(em).countBy({});
  }
}
