import { EntityManager, ObjectLiteral, Repository } from 'typeorm';

export abstract class TransactionalRepository<T extends ObjectLiteral> {
  constructor(protected repository: Repository<T>) {}

  protected getRepository(em?: EntityManager): Repository<T> {
    return em ? em.getRepository(this.repository.target) : this.repository;
  }
}
