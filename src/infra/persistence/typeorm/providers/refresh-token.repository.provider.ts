import { Provider } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { RefreshTokenRepository } from '../repositories';

export const RefreshTokenRepositoryProvider: Provider = {
  inject: [DataSource],
  provide: RefreshTokenRepository,
  useFactory(dataSource: DataSource) {
    return new RefreshTokenRepository(dataSource);
  },
};
