import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { InvitationStatus } from '@app/shared/domain';

import { TransactionalRepository, TypeOrmExRepository } from '../common';
import { Invitation } from '../entities';

@TypeOrmExRepository(Invitation)
export class InvitationRepository extends TransactionalRepository<Invitation> {
  constructor(
    @InjectRepository(Invitation)
    repository: Repository<Invitation>,
  ) {
    super(repository);
  }

  async findValid(email: string, code: string, em?: EntityManager) {
    return this.getRepository(em)
      .createQueryBuilder('i')
      .where('i.email = :email', { email })
      .andWhere('i.code = :code', { code })
      .andWhere('i.status = :status', { status: InvitationStatus.Published })
      .andWhere('i.expiredAt > NOW()')
      .getOne();
  }

  async findByIdWithFarm(id: string, em?: EntityManager) {
    return this.getRepository(em).findOneOrFail({
      relations: { farm: true },
      where: { id },
    });
  }

  async insert(entityLike: DeepPartial<Invitation>, em?: EntityManager) {
    return this.getRepository(em).insert(entityLike);
  }

  async publishedIfPending(id: string, em?: EntityManager): Promise<boolean> {
    const result = await this.getRepository(em).update({ id, status: InvitationStatus.Pending }, { status: InvitationStatus.Published, updatedAt: () => 'NOW()' });

    return (result.affected ?? 0) === 1;
  }

  async failedIfPending(id: string, em?: EntityManager): Promise<boolean> {
    const result = await this.getRepository(em).update({ id, status: InvitationStatus.Pending }, { status: InvitationStatus.Failed, updatedAt: () => 'NOW()' });

    return (result.affected ?? 0) === 1;
  }

  async acceptIfPublished(id: string, em?: EntityManager): Promise<boolean> {
    const result = await this.getRepository(em).update({ id, status: InvitationStatus.Published }, { status: InvitationStatus.Accepted, updatedAt: () => 'NOW()' });

    return (result.affected ?? 0) === 1;
  }
}
