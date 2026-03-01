import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';

import { User } from '@app/infra/persistence/typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async hasOneByEmail(email: string) {
    return this.existsBy({ email });
  }

  async findOneByEmail(email: string) {
    return this.findOneBy({ email });
  }
}
