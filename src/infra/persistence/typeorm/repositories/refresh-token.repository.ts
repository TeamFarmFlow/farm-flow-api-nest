import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';

import { RefreshToken } from '@app/infra/persistence/typeorm';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(dataSource: DataSource) {
    super(RefreshToken, dataSource.createEntityManager());
  }

  async countByUserId() {
    return this.countBy({});
  }
}
