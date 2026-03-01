import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';

import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(dataSource: DataSource) {
    super(RefreshToken, dataSource.createEntityManager());
  }

  async countByUserId() {
    return this.countBy({});
  }
}
