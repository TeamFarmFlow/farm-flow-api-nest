import { Provider } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { UserRepository } from '../repositories';

export const UserRepositoryProvider: Provider = {
  inject: [DataSource],
  provide: UserRepository,
  useFactory(dataSource: DataSource) {
    return new UserRepository(dataSource);
  },
};
