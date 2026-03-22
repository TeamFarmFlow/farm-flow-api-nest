import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { FarmUserEntity } from '@app/infra/persistence/typeorm';

import { AttendanceFarmUserRepositoryPort } from '../../application';

@Injectable()
export class TypeOrmAttendanceFarmUserRepository implements AttendanceFarmUserRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(FarmUserEntity);
  }

  async getCurrentWorkDateOrFail(farmId: string, userId: string): Promise<string> {
    const farmUser = await this.getRepository()
      .createQueryBuilder('farmUser')
      .innerJoinAndSelect('farmUser.farm', 'farm')
      .where('farmUser.farmId = :farmId', { farmId })
      .andWhere('farmUser.userId = :userId', { userId })
      .getOneOrFail();

    return farmUser.farm.dateOfTimeZone;
  }
}
