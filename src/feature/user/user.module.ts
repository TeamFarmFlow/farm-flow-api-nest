import { Module } from '@nestjs/common';

import { UserRepositoryProvider } from './domain';

@Module({
  providers: [UserRepositoryProvider],
  exports: [UserRepositoryProvider],
})
export class UserModule {}
